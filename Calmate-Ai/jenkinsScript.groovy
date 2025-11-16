pipeline {
    agent any

    tools {
        gradle 'gradle'
        jdk 'openJDK17'
    }

    environment {
        SOURCE_GITHUB_URL = 'https://github.com/Cal-Mate/CalMate-Backend.git'
        MANIFESTS_GITHUB_URL = 'https://github.com/Cal-Mate/cal-mate-argo.git'
        GIT_USERNAME = 'kjin0204'
        GIT_EMAIL = 'kin0204@naver.com'
    }

    stages {
        stage('Preparation') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'docker --version'
                    } else {
                        bat 'docker --version'
                    }
                }
            }
        }
        stage('Source Build') {
            steps {
                git branch: 'main', url: "${env.SOURCE_GITHUB_URL}"
                script {
                    if (isUnix()) {
                        sh 'chmod +x ./back_end_soruce/gradlew'
                        sh './back_end_soruce/gradlew -p back_end_soruce clean build -x test'
                    } else {
                        bat '.\\back_end_soruce\\gradlew.bat -p back_end_soruce clean build -x test'
                    }
                }
            }
        }
        stage('Container Build and Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        if (isUnix()) {
                            dir('back_end_soruce'){
                            sh "docker build -t ${DOCKER_USER}/cal_mate_back:${currentBuild.number} ."
                            sh "docker build -t ${DOCKER_USER}/cal_mate_back:latest  ." }
                            sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
                            sh "docker push ${DOCKER_USER}/cal_mate_back:${currentBuild.number}"
                            sh "docker push ${DOCKER_USER}/cal_mate_back:latest"
                        } else {
                            dir('back_end_soruce'){
                            bat "docker build -t ${DOCKER_USER}/cal_mate_back:${currentBuild.number}  ."
                            bat "docker build -t ${DOCKER_USER}/cal_mate_back:latest  ." }
                            bat "docker login -u %DOCKER_USER% -p %DOCKER_PASS%"
                            bat "docker push ${DOCKER_USER}/cal_mate_back:${currentBuild.number}"
                            bat "docker push ${DOCKER_USER}/cal_mate_back:latest"
                        }
                    }
                }
            }
        }
        stage('K8S Manifest Update') {
            steps {
                // k8s-manifests 리포지토리를 main 브랜치에서 클론한다. 이때 자격 증명 github가 사용된다.
                git credentialsId: 'github',
                    url: "${env.MANIFESTS_GITHUB_URL}",
                    branch: 'main'
                
                script { 
                    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        def githubUrl = env.MANIFESTS_GITHUB_URL.replace('https://', '')
                        if (isUnix()) {
                            // Unix 시스템에서 boot-deployment.yml 파일 수정 후 commit 후 push
                            sh "sed -i '' 's/cal_mate_back:.*\$/cal_mate_back:${currentBuild.number}/g' argo_deploy/cal-mate-back-dep.yml"
                            sh "git add argo_deploy/cal-mate-back-dep.yml"
                            sh "git config --global user.name '${env.GIT_USERNAME}'"
                            sh "git config --global user.email '${env.GIT_EMAIL}'"
                            sh "git commit -m '[UPDATE] ${currentBuild.number} image versioning'"
                            // 인증 정보 포함하여 push
                            sh "git push https://${GIT_USER}:${GIT_PASS}@${githubUrl} main"
                        } else {
                            // Windows 시스템에서 boot-deployment.yml 파일 수정 후 commit 후 push
                            bat "powershell -Command \"(Get-Content argo_deploy/cal-mate-back-dep.yml) -replace 'cal_mate_back:.*', 'cal_mate_back:${currentBuild.number}' | Set-Content argo_deploy/cal-mate-back-dep.yml\""
                            bat "git add argo_deploy/cal-mate-back-dep.yml"
                            bat "git config --global user.name '${env.GIT_USERNAME}'"
                            bat "git config --global user.email '${env.GIT_EMAIL}'"
                            bat "git commit -m \"[UPDATE] ${currentBuild.number} image versioning\""
                            // Windows에서 변수 참조 방식 사용
                            bat "git push https://%GIT_USER%:%GIT_PASS%@${githubUrl} main"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                if (isUnix()) {
                    sh 'docker logout'
                } else {
                    bat 'docker logout'
                }
            }
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}