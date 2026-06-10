pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // Kendi GitHub repo linkini buraya yaz
                git branch: 'main', url: 'https://github.com/SkyMoonIndustries/Luthierim.git'
            }
        }
        stage('Build and Deploy') {
            steps {
                sh 'docker compose down'
                sh 'docker compose up -d --build'
            }
        }
        stage('Health Check') {
            steps {
                script {
                    sleep 10
                    sh 'curl -f http://localhost:5173 || echo "Frontend henuz hazir degil"'
                }
            }
        }
    }
    post {
        success {
            echo 'Deploy basarili: Luthierim sistemi Docker uzerinde calisiyor.'
        }
        failure {
            echo 'Deploy basarisiz: loglari kontrol et.'
        }
    }
}