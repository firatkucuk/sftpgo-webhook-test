# Example Test Case App

This application is basic reproduction of [this issue](https://github.com/drakkan/sftpgo/issues/1890).
A [PR](https://github.com/drakkan/sftpgo/pull/1891) is created for overcoming this issue

This simple javascript application contains 2 servers. One of them is for hosting webhook. The other one
is an http server for http filesystem support. Originally the problem is occurred while we are testing
our system for S3 Configuration. But basically it is reproducible for other providers.

# Prerequisites

You need to have docker, docker-compose and node to proceed.

# Reproducing

We need 2 sftpgo servers up and running. For that we can boot up SFTPGo servers with `docker-compose`

```shell
docker-compose up -d
```

Then install the JS dependencies:

```shell
npm i
```

First we need to run webhook server

```shell
npm run start-ws
```

As a second step we need a remote http server for fake directory listing

```shell
npm run start-hfs
```

## Connect to Original SFTPGo Server

Let's connect to the original SFTPGo server

```shell
sftp -P 2022 'test@localhost'
```

type `test` as password

let's try to go to `virtual` directory.

```
cd virtual
```

You'll get an exception:

```
realpath /virtual: failure
```

Then disconnect from this server.

## Connect to Original SFTPGo Server

Let's connect to the modified SFTPGo server

```shell
sftp -P 2023 'test@localhost'
```

type `test` as password

let's try to go to `virtual` directory.

```shell
cd virtual
```

You should be able to enter the directory successfully. You can list the directory content.

```shell
ls
```
