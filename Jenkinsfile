pipeline {
    agent {
        docker {
            image 'cimg/android:2024.11.1-node'  // Docker container with Android SDK and Node.js
            args '-v $JENKINS_HOME/npm_cache:/workspace/npm_cache -v $JENKINS_HOME/eas_cache:/workspace/.eas'  // Caching volumes
        }
    }

    environment {
        EXPO_TOKEN='-5cGzfOlWNXF2n9aqBqTjte-QxJuPo9TW-azJT7Q'                // Override HOME to WORKSPACE value
        HOME = "."
        // or override npm's cache directory (~/.npm)
        NPM_CONFIG_CACHE = "./npm"  // Point npm to the custom cache directory
    }

    stages {
        stage('Install Dependencies and Build Android') {
            steps {
                sh 'echo $HOME'
                sh 'echo $NPM_CONFIG_CACHE'
                sh 'echo $WORKSPACE'
                
                // Check Node.js version to confirm environment setup
                sh 'node -v'
                
                // Install eas-cli globally and project dependencies
                sh 'npm install -g eas-cli'
                sh 'npm install'
                
                // Build locally for Android platform using EAS
                sh 'EXPO_TOKEN=$EXPO_TOKEN eas build --platform android --local'
            }
        }
    }

    post {
        always {
            cleanWs()  // Clean workspace after the build
        }
    }
}
