# Nginx

一个高性能的HTTP和反向代理服务器，也用作邮件代理服务器

## 命令

要在 nginx 目录下使用命令

win:
- 启动： `nginx ` `start nginx`
- 快速关闭： `nginx -s stop`
- 平稳关闭: `nginx -s quit`
- 重载配置文件： `nginx -s reload`
- 检查配置文件： `nginx -t`
- 查看版本： `nginx -v`
- 指定配置文件: `nginx -c [配置文件地址]`


## 配置文件

### nginx.conf

`nginx.conf` 是 Nginx 的主配置文件，通常位于 `/etc/nginx/` 目录下

```conf

# -------启动的进程有多少个------- 根据cpu核心 多核可做高并发 （ndoe可以使用os.cpus()获取几核几线程）
worker_processes  1;

#-------日志-------
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#-------进程连接数-------
events{
    # 每个进程允许的最大连接数
    worker_connections 1024; 
}

# -------http服务器-------
http{
    # 文件扩展名与文件类型映射表 （这个出问题，常会有文件不生效的情况）
    include       mime.types;
    default_type  application/octet-stream; #默认的类型

    #nginx 特性 处理大的静态文件（效率高）,通过线程池进行分布式加载
    sendfile        on; #on 为开启状态

    #------- 超时时间-------  
    keepalive_timeout  65;

    #------- 压缩-------   html css js
    gzip on;
    #gzip_comp_level 6; #压缩级别 越高越屌 cpu消耗越高 一般都是6
    #gzip_types text/plain text/css text/xml text/javascript #指定要压缩的类型
    #gzip_static on | off | always;#压缩静态资源 .gz文件 没有就不用管

    #-------  负载均衡 -------  设置这个后需要把代理的名称也对应 
    #默认轮训从上到下
    #weight权重越大就要承受更多请求更优先
    upstream xiajibaqv {
        server 127.0.0.1:9001 weight=1;#服务器地址1
        server 127.0.0.1:9002 weight=3;#服务器地址2

        #backup 备用服务器 （容灾）
        server 127.0.0.1:9003 backup;#服务器地址3
    }

    #------限速-------  
    #$binary_remote_addr是内置变量 这里可以起其他名字但一般都是这个 one也可以自己起 10m允许的是内存大小 1r/s一秒只允许一个请求
    limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s; #限制每秒1个请求

    #-------缓存技术------- windows使用时路径必须是绝对路径 Mac可以相对路径
    #levels 缓存目录 1:2 就是有两层目录
    #keys_zone 缓存名字 hhh 大小是 10m
    #max_size 最大内存1g
    #incative 60m 60分钟内没有使用就删除
    proxy_cache_path C:/huancun/666/xxx levels=1:2 keys_zone=hhh:10m max_size=1g incative=60m;

    #-------  http服务器管理-------   （可以有很多个）
    server{
        listen       80; #端口号
        server_name  localhost; #ip地址或域名
    }

    #-------  代理-------  ， /是路劲
    location / {
        #使用限速 zone=后面的值要和上面声明的对应上 
        #burst允许短时间内突破设置的请求次数 这里就是10次请求(虽然上面设定的是每秒1次，展示容错！)
        #nodelay 没有延迟
        limit_req zone=one burst=10 nodelay;

        root html; #html的根目录
        index index.html index.htm index.php; #根目录下对应的文件
    }

    #------- 跨域-------   (服务端到服务端叫反向代理，客户端向客户端是正向代理)
    location /api{ #这里api可自定义名称 发情求时用这个代替下面的链接

        #代理到 9001 端口
        #如果出现 404 就要检查请求的接口是否带有api 如果你定义的接口是/api/list就没问题，但你的接口是/list ，但访问时因为代理就会变成了 /api/list 就会404
        #proxy_pass http://localhost:9001; 

        #设置负载均衡后要和均衡名称一样
        proxy_pass http://xiajibaqv; 

        #用正则把api去掉
        rewrite ^/api/(.*) /$1 break;

    }

    #-------防盗链-------（拦截图片资源来做防盗链）
    location ~*.*\.(jpg|jpeg|gif|png|ico)$ {

        #使用缓存
        proxy_cache hhh; #缓存名字 上面配置的对应上
        proxy_cache_methods GET;#请求的方式
        proxy_cache_key $host$url$is_args$args; #缓存key 这里写的是:主机+域名?参数(有参数就带没有就不带)
        proxy_cache_valid 200 302 10m; #缓存策略 时间
        proxy_cache_min_uses 3; #最少使用3次才缓存

        root html/static; #访问图片时就不用带static目录了

        #none 允许Referer为空 在调试时浏览器直接访问会更方便
        #blocked 允许Referer没有 
        #localhost 允许来源是localhost
        #valid_referers none blocked localhost;

        #这里设置后 就会检查请求头的Referer是不是我们设置的ip或域名，如果不是就返回403
        valid_referers 127.0.0.1 http://localhost; #允许访问的域名 满足一个就可以
        if ($invalid_referer) { #不符合就返回403
            return 403;
        }
    }

    #-------报错页面------- 在 500 502 503 504 时，返回的页面
    error_page   500 502 503 504  /50x.html;
    location = /50.html{
        root    html;
    }

    #-------  配置https-------  
    server { #每个server是独立 上面配置的防盗链这里要重新配置一下
        listen       443 ssl;#默认走443端口
        server_name  localhost;

        ssl_certificate      cert.pem;#这里换成自己的证书就行
        ssl_certificate_key  cert.key;#这里换成自己的证书就行

        ssl_session_cache    shared:SSL:1m;
        ssl_session_timeout  5m;

        ssl_ciphers  HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers  on;

        location / {
            root   html;
            index  index.html index.htm;
        }
    }
}
```

配置https需要证书，使用openssl生成：

1. 生成私钥
```sh
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
```

2. 生成证书请求文件 CSR
```sh
openssl req -new -key private.key -out csr.csr
```

3. 通过csr生成证书

```sh
openssl x509 -req -in csr.csr -signkey private.key -out certificate.crt
```

#### vue路由问题

只有使用history才会出现

原因就是histroy是虚拟的路由，并不是真实地址 而nginx寻找的是真实的地址

因为vue正好是单页应用加入以下配置解决：
```conf
 try_files $uri $uri/ /index.html;
```


## 内置变量对照表

| 变量                       | 说明                                                         |
| -------------------------- | ------------------------------------------------------------ |
| $arg_*name*                | 表示请求行中的任意参数，*name* 为参数名称                    |
| $args                      | 表示请求行中的参数部分                                       |
| $binary_remote_addr        | 二进制形式表示的客户端地址                                   |
| $body_bytes_sent           | 发送到客户端的字节数，不包括响应头                           |
| $bytes_received            | 接受到客户端的字节数                                         |
| $bytes_sent                | 发送到客户端的字节数                                         |
| $connection                | 连接序列号                                                   |
| $connection_requests       | 当前连接的请求数量                                           |
| $connection_time           | 连接时间，单位为：ms                                         |
| $cookie_*name*             | 表示任意 cookie，*name* 为 cookie 名称                       |
| $date_gmt                  | GMT 时间                                                     |
| $date_local                | 本地时间                                                     |
| $host                      | 按照以下顺序获取主机信息：请求行中的主机名，或“Host”请求头字段中的主机名，或与请求匹配的服务器名。 |
| $hostname                  | 主机名                                                       |
| $http_*name*               | 表示任意请求头；*name* 为请求头名称，其中破折号被下划线替换并转换为小写；如：$http_user_agent，$http_x_forwarded_for |
| $proxy_add_x_forwarded_for | 将 $remote_addr 的值附加到“X−Forwarded−For”客户端请求头中，由逗号分隔。如果客户端请求头中不存在“X−Forwarded−For”，则 $proxy_add_x_forwarded_for 等于 $remote_addr 。 |
| $proxy_host                | 代理服务器的地址和端口                                       |
| $proxy_port                | 代理服务器的端口                                             |
| $query_string              | 同 $args                                                     |
| $remote_addr               | 客户端地址                                                   |
| $remote_port               | 客户端端口                                                   |
| $remote_user               | Basic 身份验证中提供的用户名                                 |
| $request                   | 完整请求行                                                   |
| $request_body              | 请求体                                                       |
| $request_body_file         | 保存请求体的临时文件                                         |
| $request_length            | 请求长度（包括请求行、头部和请求体）                         |
| $request_method            | 请求方法                                                     |
| $request_time              | 请求处理时间，单位为：ms                                     |
| $request_uri               | 完整请求行                                                   |
| $scheme                    | 请求协议，http 或 https                                      |
| $server_addr               | 接受请求的服务器地址                                         |
| $server_name               | 接受请求的服务器名称                                         |
| $server_port               | 接受请求的服务器端口                                         |
| $server_protocol           | 请求协议，通常为 HTTP/1.0、HTTP/1.1 或 HTTP/2.0              |
| $ssl_cipher                | 建立 SSL 连接所使用的加密套件名称                            |
| $ssl_ciphers               | 客户端支持的加密套件列表                                     |
| $ssl_client_escaped_cert   | 客户端 PEM 格式的证书                                        |
| $ssl_protocol              | 建立 SSL 连接的协议                                          |
| $status                    | 响应状态码                                                   |
| $time_iso8601              | ISO 8601 标准格式的本地时间                                  |
| $time_local                | Common Log 格式的本地时间                                    |
| $upstream_addr             | upstream 服务器的 ip 和端口                                  |
| $upstream_bytes_received   | 从 upstream 服务器接收的字节数                               |
| $upstream_bytes_sent       | 发送给 upstream 服务器的字节数                               |
| $upstream_http_*name*      | 表示 upstream 服务器任意响应头，*name* 为响应头名称，其中破折号被下划线替换并转换为小写 |
| $upstream_response_length  | upstream 服务器的响应长度，单位为：字节                      |
| $upstream_response_time    | upstream 服务器的响应时间，单位为：秒                        |
| $upstream_status           | upstream 服务器的响应状态码                                  |
| $uri                       | 请求 uri 