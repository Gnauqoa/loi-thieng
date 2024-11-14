pipeline {
    agent none  // Đặt agent cho toàn bộ pipeline, mỗi stage sẽ có agent riêng

    environment {
        EXPO_TOKEN = credentials('EXPO_TOKEN')  // Đảm bảo EXPO_TOKEN đã được cấu hình trong Jenkins credentials
        NPM_CONFIG_CACHE = ".npm"
        HOME = '.'
    }

    stages {
        stage('Setup Node.js and EAS CLI') {
            agent {
                docker { image 'node:18' }  // Docker container với Node.js
            }
            steps {
                // Cài đặt eas-cli trong Docker Node.js
                sh 'npm install -g eas-cli'
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
