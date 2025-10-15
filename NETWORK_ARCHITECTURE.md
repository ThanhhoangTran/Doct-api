# 🏗️ Network Architecture Documentation - Doct API

## 📋 Tổng quan (Overview)

Dự án **Doct API** được xây dựng trên kiến trúc serverless sử dụng AWS Lambda, RDS PostgreSQL, và các dịch vụ AWS khác. Tài liệu này mô tả chi tiết về cấu trúc mạng (network architecture) và cách thức hoạt động của hệ thống.

## 🎯 Mục tiêu cuối cùng (Final Architecture Goals)

Sau khi hoàn thành setup, bạn sẽ có:

- ✅ **1 VPC riêng** (ví dụ: `doct-dev-vpc`)
- ✅ **2 subnets riêng** (ở 2 AZ khác nhau)
- ✅ **1 security group cho Lambda**
- ✅ **1 security group cho RDS**
- ✅ **RDS (PostgreSQL)** nằm trong private subnet
- ✅ **Lambda** nằm trong cùng VPC/subnet → có thể truy cập DB
- ✅ **Lambda function URL hoặc API Gateway** → public để gọi từ Internet

## 🎨 Sơ đồ kiến trúc (Architecture Diagram)

```
┌─────────────────────────────────────────────────────────────────┐
│                           INTERNET                              │
└─────────────────────────┬───────────────────────────────────────┘
                          │
                ┌─────────▼─────────┐
                │ Internet Gateway  │
                │    (doct-igw)     │
                └─────────┬─────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                    API GATEWAY                                  │
│              (Public Endpoint)                                  │
└─────────────────────────┬───────────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────────┐
│                     AWS VPC                                     │
│                  (doct-dev-vpc)                                 │
│                  10.0.0.0/16                                    │
│                                                                 │
│ ┌─────────────────────┐           ┌────────────────
│ │   PUBLIC SUBNET     │           │   PRIVATE SUBNET    │      │
│ │  (doct-subnet-a)    │           │  (doct-subnet-b)    │      │
│ │   10.0.1.0/24       │           │   10.0.2.0/24       │      │
│ │   AZ: ap-southeast-1a│           │   AZ: ap-southeast-1b│      │
│ │                     │           │                     │      │
│ │ ┌─────────────────┐ │           │ ┌─────────────────┐ │      │
│ │ │  Lambda Function│ │    ──────▶│ │   RDS PostgreSQL│ │      │
│ │ │   (sg-lambda)   │ │   Port 5432│ │    (sg-rds)     │ │      │
│ │ └─────────────────┘ │           │ └─────────────────┘ │      │
│ │                     │           │                     │      │
│ │ ┌─────────────────┐ │           │                     │      │
│ │ │   SQS Worker    │ │           │                     │      │
│ │ │   Lambda        │ │           │                     │      │
│ │ └─────────────────┘ │           │                     │      │
│ │                     │           │                     │      │
│ │ ┌─────────────────┐ │           │ ┌─────────────────┐ │      │
│ │ │ Public Route    │ │           │ │ Private Route   │ │      │
│ │ │ Table (RT)      │ │           │ │ Table (RT)      │ │      │
│ │ │ doct-public-rt  │ │           │ │ doct-private-rt │ │      │
│ │ │                 │ │           │ │                 │ │      │
│ │ │ • 10.0.0.0/16   │ │           │ │ • 10.0.0.0/16  │ │        │
│ │ │   → local       │ │           │ │   → local       │ │       │
│ │ │ • 0.0.0.0/0     │ │           │ │                 │ │       │
│ │ │   → IGW         │ │           │ │ (Chỉ local      │ │       │
│ │ └─────────────────┘ │           │ │  routing)       │ │       │
│ └─────────────────────┘           │ └─────────────────┘ │       │
│                                   └─────────────────────┘       │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                      S3 Bucket                              │ │
│ │                 (doct-api-s3-bucket)                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                    SQS Queues                               │ │
│ │  ┌─────────────────┐    ┌─────────────────────────────────┐ │ │
│ │  │  Message Queue  │    │     Dead Letter Queue           │ │ │
│ │  │  (Normal Queue) │───▶│      (Error Handling)           │ │ │
│ │  └─────────────────┘    └─────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                     ▲                                           │
│                     │ (Private connection                       │
│                     │  via VPC Endpoint)                        │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                 VPC Endpoint Interface                      │ │
│ │              (com.amazonaws.ap-southeast-1.sqs)             │ │
│ │                                                             │ │
│ │   Deployed in both subnets:                                 │ │
│ │                                                             │ │
│ │   • doct-subnet-b (ENI: 10.0.2.x)                           │ │
│ │                                                             │ │
│ │   Route: Lambda → VPC Endpoint → AWS SQS Service            │ │
│ │   • DNS: sqs.ap-southeast-1.amazonaws.com → Private IPs     │ │
│ │   • Security Group: sg-sqs-endpoint                         │ │
│ │   • Protocol: HTTPS (Port 443)                              │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🛠️ Chi tiết từng thành phần (Detailed Components)

### 🌐 VPC (Virtual Private Cloud)

```yaml
# Từ serverless.yml
vpc:
  securityGroupIds:
    - sg-0d0a771c00a4491c5
  subnetIds:
    - subnet-0a8ee345922b2bc68
```

**Tại sao cần VPC?**

- **Cô lập mạng**: Tạo ra một mạng riêng biệt, an toàn cho ứng dụng
- **Kiểm soát truy cập**: Chỉ những resource được phép mới có thể giao tiếp với nhau
- **Bảo mật database**: RDS nằm trong private subnet, không thể truy cập trực tiếp từ Internet

### �️ Route Tables (Bảng định tuyến)

Route Tables quyết định cách traffic được định tuyến trong VPC và ra ngoài Internet.

#### 1. Public Route Table (doct-public-rt)

```yaml
# Route Table cho Public Subnet
Routes:
  - Destination: 10.0.0.0/16
    Target: local # Traffic nội bộ VPC
  - Destination: 0.0.0.0/0
    Target: igw-xxxxx # Traffic ra Internet qua IGW

Associated Subnets:
  - doct-subnet-a (Public)
```

**Chức năng:**

- **Local routing**: Cho phép communication giữa các subnet trong VPC
- **Internet access**: Route traffic ra Internet qua Internet Gateway
- **Lambda Internet access**: Lambda có thể gọi external APIs và download packages

#### 2. Private Route Table (doct-private-rt)

```yaml
# Route Table cho Private Subnet
Routes:
  - Destination: 10.0.0.0/16
    Target: local # Chỉ có local traffic

Associated Subnets:
  - doct-subnet-b (Private)
```

**Chức năng:**

- **Isolated network**: Không có route ra Internet → bảo mật cao
- **Database protection**: RDS không thể bị truy cập từ Internet
- **Internal communication**: Chỉ giao tiếp với resources khác trong VPC

#### 3. Route Table cho VPC Endpoints

```yaml
# VPC Endpoint routing (tự động)
Route Resolution:
  - DNS: sqs.ap-southeast-1.amazonaws.com
  - Resolves to: VPC Endpoint ENI private IPs
  - Traffic path: Lambda → VPC Endpoint → AWS SQS (không qua Internet)
```

**Lợi ích routing thông qua VPC Endpoint:**

- **Bypasses IGW**: Traffic không đi qua Internet Gateway
- **Private routing**: Sử dụng AWS backbone network
- **Automatic failover**: Multiple ENIs across AZs cho high availability

### �🔧 Lambda Functions

#### 1. Client Server Lambda

```yaml
clientServer:
  handler: src/handlers/clientServer.handler
  events:
    - http:
        path: /client
        method: any
```

**Vai trò**: Xử lý các request HTTP từ client (web/mobile app)

#### 2. SQS Worker Lambda

```yaml
sqsMessageExecutor:
  handler: ./src/handlers/sqsWorker.handler
  events:
    - sqs: arn:aws:sqs:${aws:region}:${aws:accountId}:${self:custom.sqs}
```

**Vai trò**: Xử lý các message từ SQS queue (background processing)

### 🗄️ Database (RDS PostgreSQL)

**Cấu hình từ environment:**

```yaml
environment:
  DB_URL: ${env:DB_URL}
```

**Tại sao đặt trong Private Subnet?**

- **Bảo mật cao**: Không thể truy cập trực tiếp từ Internet
- **Chỉ Lambda mới truy cập được**: Thông qua security group rules
- **Backup tự động**: AWS RDS tự động backup và maintain

### 📨 SQS (Simple Queue Service)

```yaml
# Message Queue Configuration
MessageQueue:
  Type: AWS::SQS::Queue
  Properties:
    QueueName: ${self:custom.sqs}
    VisibilityTimeout: 660
    RedrivePolicy:
      deadLetterTargetArn:
        Fn::GetAtt:
          - DeadLetterQueue
          - Arn
      maxReceiveCount: 4
```

**Tại sao dùng SQS?**

- **Xử lý bất đồng bộ**: Các tác vụ nặng không làm chậm API response
- **Retry mechanism**: Tự động retry khi processing thất bại
- **Dead Letter Queue**: Lưu trữ messages lỗi để debug

### 🔌 VPC Endpoint Interface cho SQS

**Cấu hình VPC Endpoint:**

```yaml
# VPC Endpoint for SQS
SQSVPCEndpoint:
  Type: AWS::EC2::VPCEndpoint
  Properties:
    VpcId: !Ref DoctVPC
    ServiceName: com.amazonaws.ap-southeast-1.sqs
    VpcEndpointType: Interface
    SubnetIds:
      - !Ref PrivateSubnetA
      - !Ref PrivateSubnetB
    SecurityGroupIds:
      - !Ref SQSEndpointSecurityGroup
    PolicyDocument:
      Statement:
        - Effect: Allow
          Principal: '*'
          Action:
            - sqs:SendMessage
            - sqs:ReceiveMessage
            - sqs:DeleteMessage
            - sqs:GetQueueAttributes
          Resource: '*'
```

**Lợi ích của VPC Endpoint Interface:**

1. **🔒 Bảo mật cao hơn**:
   - Traffic từ Lambda đến SQS không đi qua Internet
   - Kết nối private trong AWS network backbone
   - Giảm attack surface và risk exposure
   - Tuân thủ compliance requirements

2. **⚡ Hiệu suất tốt hơn**:
   - Latency thấp hơn (không qua Internet Gateway)
   - Bandwidth không bị giới hạn bởi NAT Gateway
   - Direct connection đến SQS service qua AWS backbone
   - Consistent performance, không bị ảnh hưởng Internet congestion

3. **💰 Tiết kiệm chi phí**:
   - Không cần NAT Gateway cho outbound SQS calls
   - Giảm data transfer costs (no internet egress charges)
   - VPC Endpoint cost thường thấp hơn NAT Gateway
   - Scalable cost model

**Cách hoạt động:**

```
┌─────────────┐    ┌──────────────────┐    ┌─────────────┐
│   Lambda    │───▶│ VPC Endpoint     │───▶│ SQS Service │
│ (VPC Subnet)│    │ Interface        │    │ (AWS Managed)│
└─────────────┘    └──────────────────┘    └─────────────┘
      │                       │                     │
   Private               Private                AWS Service
   Network              Connection             (Highly Available)
```

**Security Group cho VPC Endpoint:**

```yaml
SQSEndpointSecurityGroup:
  Type: AWS::EC2::SecurityGroup
  Properties:
    GroupDescription: Security group for SQS VPC endpoint
    VpcId: !Ref DoctVPC
    SecurityGroupIngress:
      - IpProtocol: tcp
        FromPort: 443
        ToPort: 443
        SourceSecurityGroupId: !Ref LambdaSecurityGroup
        Description: Allow HTTPS from Lambda to SQS endpoint
    SecurityGroupEgress:
      - IpProtocol: tcp
        FromPort: 443
        ToPort: 443
        CidrIp: 0.0.0.0/0
        Description: Allow HTTPS to SQS service
    Tags:
      - Key: Name
        Value: sg-sqs-endpoint
```

**DNS Resolution:**

- VPC Endpoint tạo private DNS names cho SQS service
- Lambda có thể sử dụng standard SQS endpoint URLs
- AWS SDK tự động route qua VPC endpoint khi có sẵn

### 🪣 S3 Storage

```yaml
S3Bucket:
  Type: AWS::S3::Bucket
  Properties:
    CorsConfiguration:
      CorsRules:
        - AllowedHeaders: ['*']
          AllowedMethods: [GET, POST, PUT]
          AllowedOrigins: ['*']
```

**Vai trò**: Lưu trữ files (images, documents, etc.)

## 🧱 Hướng dẫn Setup từng bước (Step-by-step Setup Guide)

### Bước 1: Tạo mới VPC

```bash
# Mở AWS Console → VPC → Your VPCs → Create VPC
```

**Cấu hình:**

- **Name tag**: `doct-dev-vpc`
- **IPv4 CIDR block**: `10.0.0.0/16`
- **Tenancy**: Default

**Giải thích**: VPC với CIDR `10.0.0.0/16` có thể chứa tối đa 65,536 IP addresses (từ 10.0.0.1 đến 10.0.255.254)

### Bước 2: Tạo 2 Subnets

#### Subnet A (Public - cho Lambda)

- **Name**: `doct-subnet-a`
- **AZ**: `ap-southeast-1a`
- **IPv4 CIDR**: `10.0.1.0/24` (256 IPs)

#### Subnet B (Private - cho RDS)

- **Name**: `doct-subnet-b`
- **AZ**: `ap-southeast-1b`
- **IPv4 CIDR**: `10.0.2.0/24` (256 IPs)

**Tại sao cần 2 AZ?**

- **High Availability**: RDS yêu cầu tối thiểu 2 AZ
- **Disaster Recovery**: Nếu 1 AZ gặp sự cố, ứng dụng vẫn hoạt động

### Bước 3: Tạo Internet Gateway

```bash
# Name: doct-igw
# Attach to: doct-dev-vpc
```

**Tại sao cần IGW?**

- Lambda cần access Internet để gọi external APIs
- API Gateway cần route traffic từ Internet vào Lambda

### Bước 4: Cấu hình Route Tables

#### 4.1. Tạo Public Route Table (doct-public-rt)

```bash
# AWS Console → VPC → Route tables → Create route table
Name: doct-public-rt
VPC: doct-dev-vpc
```

**Thêm Routes:**

```yaml
Routes:
  - Destination: 10.0.0.0/16
    Target: local # Tự động có sẵn
  - Destination: 0.0.0.0/0 # Thêm route này
    Target: doct-igw # Internet Gateway
```

**Associate Subnet:**

- Chọn `Subnet associations` → `Edit subnet associations`
- Chọn `doct-subnet-a` (Public subnet)

**Giải thích routes:**

- `10.0.0.0/16 → local`: Traffic trong VPC được route local
- `0.0.0.0/0 → IGW`: Tất cả traffic khác đi ra Internet qua IGW

#### 4.2. Tạo Private Route Table (doct-private-rt)

```bash
# AWS Console → VPC → Route tables → Create route table
Name: doct-private-rt
VPC: doct-dev-vpc
```

**Routes mặc định:**

```yaml
Routes:
  - Destination: 10.0.0.0/16
    Target: local # Chỉ có route này
    # KHÔNG thêm 0.0.0.0/0 → IGW
```

**Associate Subnet:**

- Chọn `Subnet associations` → `Edit subnet associations`
- Chọn `doct-subnet-b` (Private subnet)

**Tại sao không có Internet route?**

- **Bảo mật**: RDS không thể bị truy cập từ Internet
- **Isolation**: Database hoàn toàn cô lập
- **VPC Endpoint**: Lambda vẫn có thể gọi AWS services qua VPC Endpoint

### Bước 5: Tạo Security Groups

#### Security Group cho Lambda (sg-lambda)

```yaml
# Inbound: Không cần (Lambda được gọi qua API Gateway)
# Outbound: All traffic → 0.0.0.0/0 (cần Internet access)
```

#### Security Group cho RDS (sg-rds)

```yaml
# Inbound:
Type: PostgreSQL
Port: 5432
Source: sg-lambda
# Outbound: Default (all traffic)
```

**Nguyên tắc bảo mật**: Chỉ cho phép Lambda truy cập database qua port 5432

### Bước 6: Tạo VPC Endpoint cho SQS

**Tạo VPC Endpoint Interface:**

```bash
# AWS Console → VPC → Endpoints → Create Endpoint
```

**Cấu hình:**

- **Service Category**: AWS services
- **Service Name**: `com.amazonaws.ap-southeast-1.sqs`
- **VPC**: doct-dev-vpc
- **Subnets**: chọn cả doct-subnet-a và doct-subnet-b
- **Security Groups**: sg-sqs-endpoint (tạo riêng)
- **Policy**: Full Access (hoặc custom policy như mô tả ở trên)

**Tại sao cần VPC Endpoint cho SQS?**

- **Bảo mật**: Lambda gọi SQS không qua Internet, traffic private hoàn toàn
- **Hiệu suất**: Latency thấp hơn, bandwidth cao hơn, không bị giới hạn NAT Gateway
- **Chi phí**: Không cần NAT Gateway cho SQS calls, tiết kiệm data transfer cost

### Bước 7: Tạo RDS PostgreSQL

**Cấu hình quan trọng:**

- **Engine**: PostgreSQL
- **VPC**: doct-dev-vpc
- **Subnets**: doct-subnet-a, doct-subnet-b
- **Public access**: ❌ **NO**
- **Security group**: sg-rds

### Bước 8: Deploy Lambda với VPC

```yaml
# serverless.yml
vpc:
  securityGroupIds:
    - sg-lambda-id
  subnetIds:
    - subnet-doct-subnet-a-id
```

## 🔒 Security Best Practices

### 1. Network Segmentation

- **Public Subnet**: Chỉ chứa Lambda (cần Internet access)
- **Private Subnet**: Chỉ chứa RDS (không Internet access)

### 2. Security Groups (Firewall Rules)

```yaml
# Lambda SG: Outbound only
# RDS SG: Inbound từ Lambda SG only
```

### 3. IAM Permissions

```yaml
iam:
  role:
    statements:
      - Effect: Allow
        Action:
          - sqs:*
        Resource:
          - { Fn::GetAtt: [MessageQueue, Arn] }
          - { Fn::GetAtt: [DeadLetterQueue, Arn] }
```

**Nguyên tắc**: Principle of Least Privilege - chỉ cấp quyền tối thiểu cần thiết

## 📊 Traffic Flow (Luồng dữ liệu)

### 1. API Request Flow

```
Client → API Gateway → Lambda (Public Subnet) → RDS (Private Subnet)
```

### 2. Background Processing Flow với VPC Endpoint

```
Lambda → VPC Endpoint Interface → SQS Queue → SQS Worker Lambda → RDS
   │              │                   │             │              │
 Private      Private Route       AWS Service    Private        Private
 Subnet        (No Internet)       (Managed)     Subnet         Subnet
```

**Chi tiết luồng SQS:**

1. **Lambda gửi message**:
   - Lambda call SQS API qua VPC Endpoint
   - Traffic không ra Internet, đi qua AWS backbone
   - DNS resolve `sqs.ap-southeast-1.amazonaws.com` → VPC Endpoint private IP

2. **SQS Worker nhận message**:
   - SQS service trigger Lambda function
   - Message được process trong cùng VPC
   - Kết quả lưu vào RDS qua private connection

### 3. File Upload Flow

```
Client → API Gateway → Lambda → S3 Bucket
```

### 4. So sánh Route Tables: Với và không có VPC Endpoint

**📊 Bảng so sánh routing paths:**

| Traffic Type         | Source        | Destination   | Without VPC Endpoint             | With VPC Endpoint             |
| -------------------- | ------------- | ------------- | -------------------------------- | ----------------------------- |
| **Lambda → SQS**     | doct-subnet-a | SQS Service   | Public RT → IGW → Internet → SQS | Local RT → VPC Endpoint → SQS |
| **Lambda → RDS**     | doct-subnet-a | doct-subnet-b | Local routing (10.0.0.0/16)      | Local routing (10.0.0.0/16)   |
| **SQS Worker → RDS** | doct-subnet-a | doct-subnet-b | Local routing (10.0.0.0/16)      | Local routing (10.0.0.0/16)   |
| **Internet → API**   | Internet      | doct-subnet-a | IGW → Public RT → Lambda         | IGW → Public RT → Lambda      |

**Không có VPC Endpoint (traditional):**

```
Lambda → Public Route Table → Internet Gateway → Internet → SQS Service
  │              │                    │            │           │
Private      doct-public-rt         doct-igw    Public    AWS Service
Subnet      (0.0.0.0/0 → IGW)      (NAT cost)   Internet  (Higher cost)
```

**Có VPC Endpoint (optimized):**

```
Lambda → Local Route Table → VPC Endpoint Interface → SQS Service
  │              │                      │                    │
Private     Auto-routing           Private ENI           AWS Service
Subnet     (DNS resolution)     (10.0.1.x/10.0.2.x)   (Lower latency)
```

**Chi tiết Route Table entries:**

**Public Route Table (doct-public-rt):**

```
Destination    Target       Purpose
10.0.0.0/16   local        Internal VPC communication
0.0.0.0/0     igw-xxxxx    Internet access (for external APIs)
```

**Private Route Table (doct-private-rt):**

```
Destination    Target       Purpose
10.0.0.0/16   local        Internal VPC communication only
```

**VPC Endpoint DNS Resolution:**

```
# Khi Lambda gọi SQS:
Original: https://sqs.ap-southeast-1.amazonaws.com
Resolves to: 10.0.1.100, 10.0.2.100 (VPC Endpoint ENI IPs)
Route: Sử dụng local routing thay vì Internet Gateway
```

## 🔧 Monitoring & Debugging

### CloudWatch Logs

- **Lambda logs**: Xem execution logs và errors
- **VPC Flow logs**: Monitor network traffic
- **RDS logs**: Database query performance

### Common Issues & Solutions

#### 1. Lambda Timeout khi connect DB

```yaml
# Solution: Tăng timeout và kiểm tra security groups
timeout: 30 # seconds
```

#### 2. Cold Start trong VPC

```yaml
# Solution: Provisioned Concurrency hoặc keep-warm
provisionedConcurrency: 2
```

#### 3. Database Connection Pool

```typescript
// Sử dụng connection pooling
const pool = new Pool({
  connectionString: process.env.DB_URL,
  max: 1, // Limit connections per Lambda
});
```

## 📈 Scaling Considerations

### 1. Lambda Scaling

- **Concurrent executions**: Tối đa 1000 concurrent Lambda instances
- **VPC ENI limits**: Mỗi Lambda trong VPC cần Elastic Network Interface

### 2. RDS Scaling

- **Read Replicas**: Tạo read-only replicas cho read-heavy workloads
- **Auto Scaling**: Tự động scale storage khi cần

### 3. SQS Scaling

- **Standard Queue**: Unlimited throughput
- **FIFO Queue**: 3000 messages/second với batching

### 4. VPC Endpoint Scaling

- **Automatic scaling**: VPC Endpoint tự động scale theo traffic
- **Multi-AZ**: Deploy endpoint trên nhiều AZ để high availability
- **Bandwidth**: Không có giới hạn bandwidth như NAT Gateway

## 💰 Cost Optimization

### 1. Lambda

- **Memory allocation**: Optimize memory vs execution time
- **Provisioned Concurrency**: Chỉ dùng khi cần thiết

### 2. RDS

- **Instance sizing**: Start với t3.micro cho development
- **Storage**: Sử dụng gp2 thay vì io1 nếu không cần high IOPS

### 3. VPC Endpoint vs NAT Gateway

**VPC Endpoint Interface cost:**

```
- $0.01/hour per VPC endpoint (~$7.3/month)
- $0.01/GB data processed
- Không có bandwidth limits
```

**NAT Gateway cost (nếu không dùng VPC Endpoint):**

```
- $0.045/hour per NAT Gateway (~$32.85/month)
- $0.045/GB data transfer
- Có bandwidth limits
```

**Phân tích cost:**

- **Break-even point**: ~16GB data/month
- **VPC Endpoint rẻ hơn** khi SQS traffic > 16GB/month
- **Bonus**: Không cần NAT Gateway cho SQS calls → tiết kiệm thêm

### 4. VPC

- **Internet Gateway**: Miễn phí cho inbound traffic
- **VPC Endpoint**: Cost-effective cho high-traffic AWS services

## 🚀 Deployment Commands

```bash
# Deploy toàn bộ stack
serverless deploy

# Deploy specific function
serverless deploy function --function clientServer

# Xem logs
serverless logs --function clientServer --tail

# Remove stack
serverless remove
```

## 📚 Tài liệu tham khảo (References)

- [AWS VPC Documentation](https://docs.aws.amazon.com/vpc/)
- [AWS Lambda in VPC](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [Serverless Framework Guide](https://www.serverless.com/framework/docs/)
- [AWS RDS Security Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html)

---

**Lưu ý**: Thay thế các giá trị placeholder (như security group IDs, subnet IDs) bằng giá trị thực tế từ AWS Console sau khi tạo resources.
