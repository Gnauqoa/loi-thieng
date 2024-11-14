pipeline {
    agent none  // Đặt agent cho toàn bộ pipeline, mỗi stage sẽ có agent riêng

    environment {
        EXPO_TOKEN='-5cGzfOlWNXF2n9aqBqTjte-QxJuPo9TW-azJT7Q'                // Override HOME to WORKSPACE value
        HOME = "."
        // or override npm's cache directory (~/.npm)
        NPM_CONFIG_CACHE = "./npm"
    }

    stages {
        stage('Setup Node.js and EAS CLI') {
            agent {
                docker { image 'node:18' }  // Docker container với Node.js
            }
            steps {
              sh 'echo $HOME'
              sh 'echo $NPM_CONFIG_CACHE'
              sh 'echo $WORKSPACE'
                // Cài đặt eas-cli trong Docker Node.js
                sh 'npm install eas-cli'
            }
        }

        stage('Install Dependencies') {
            agent {
                docker { image 'node:18' }  // Docker container với Node.js
            }
            steps {
                // Cài đặt các dependency cho dự án Expo
                sh 'npm install'
            }
        }

        stage('Build Android Locally') {
            agent {
                docker { image 'cimg/android:2023.09.1' }  // Docker container với Android SDK
            }
            steps {
                // Xác thực với Expo nếu cần (có thể sử dụng EXPO_TOKEN khi cần)
                sh 'echo $EXPO_TOKEN'  // In giá trị EXPO_TOKEN (hoặc có thể bỏ qua nếu không cần)

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
            cleanWs()  // Dọn dẹp workspace sau khi build xong
        }
    }
}
