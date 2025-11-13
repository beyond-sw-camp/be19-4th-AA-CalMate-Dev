#!/bin/bash

echo "======================================"
echo "Section03 - Kubernetes 통합 환경 배포"
echo "======================================"
echo ""

# 배포 순서대로 실행
echo "1. PersistentVolumeClaim 생성..."
kubectl apply -f mariadb-pvc.yml
echo ""

echo "2. MariaDB 배포 중..."
kubectl apply -f cal-mate-mariadb-dep.yml
kubectl apply -f cal-mate-mariadb-ser.yml
echo ""

echo "3. MariaDB Pod가 Ready 상태가 될 때까지 대기 중..."
kubectl wait --for=condition=ready pod -l app=cal-mate-mariadb-kube --timeout=60s
echo ""

echo "4. Spring Boot 배포 중..."
kubectl apply -f cal-mate-back-dep.yml
kubectl apply -f cal-mate-back-ser.yml
echo ""

echo "5. Spring Boot Pod가 Ready 상태가 될 때까지 대기 중..."
kubectl wait --for=condition=ready pod -l app=cal-mate-back-kube --timeout=60s
echo ""

echo "6. Vue.js 배포 중..."
kubectl apply -f cal-mate-front-dep.yml
kubectl apply -f cal-mate-front-ser.yml
echo ""

echo "7. Ingress 배포 중..."
kubectl apply -f cal-mate-ingress.yml
echo ""

echo "======================================"
echo "배포 완료!"
echo "======================================"
echo ""

echo "리소스 상태 확인:"
kubectl get pods
echo ""
kubectl get svc
echo ""
kubectl get pvc
echo ""
kubectl get ingress
echo ""


