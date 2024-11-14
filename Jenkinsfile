pipeline {
    agent any
    environment {
        NODE_VERSION = '18'
        ANDROID_SDK_ROOT = "/Users/quang/Library/Android/sdk/tools/bin"  // Update this path to your Android SDK location
        PATH = "${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools:${ANDROID_SDK_ROOT}/emulator:${PATH}"
    }
    stages {
         stage('Install Node.js') {
            steps {
                // Direct installation without sudo
                sh '''
                curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
                apt-get install -y nodejs
                '''
            }
        }
        
        stage('Install EAS CLI') {
            steps {
                // Install EAS CLI globally
                sh 'npm install -g eas-cli'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install project dependencies
                sh 'npm install'
            }
        }

        stage('Build Android Locally') {
            steps {
                script {
                    // Authenticate with EAS (if required, ensure EAS credentials are set in Jenkins)
                    sh 'eas login --token $EAS_TOKEN'

                    // Run the local build for Android
                    sh 'eas build --platform android --local'
                }
            }
        }

        // stage('Build iOS Locally') {
        //     steps {
        //         script {
        //             // Run the local build for iOS (requires macOS machine with Xcode)
        //             sh 'eas build --platform ios --local'
        //         }
        //     }
        // }
    }
    post {
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
