pipeline {
    agent {
      docker { image 'cimg/android:2023.09.1' }
      docker { image 'node:18' }
    }

    environment {
        EXPO_TOKEN = credentials('EXPO_TOKEN')
    }

    stages {
        stage('Setup') {
            steps {
                // Cài đặt eas-cli trong Docker Node.js
                sh 'npm install -g eas-cli'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Cài đặt các dependency cho dự án Expo
                sh 'npm install'
            }
        }

        stage('Build Android Locally') {
            steps {
                // Xác thực với Expo nếu cần (sử dụng EAS token)
                // sh 'eas login --token $EAS_TOKEN'
                sh 'cat $EXPO_TOKEN'
                
                // Thực hiện build local cho nền tảng Android
                sh 'EXPO_TOKEN=$EXPO_TOKEN eas build --platform android --local'
            }
        }

        // stage('Build iOS Locally') {
        //     agent {
        //         docker { image 'cimg/android:2023.09.1' }
        //     }
        //     steps {
        //         // Thực hiện build local cho nền tảng iOS
        //         sh 'eas build --platform ios --local'
        //     }
        // }
    }

    post {
        always {
            cleanWs()
        }
    }
}
