pipeline {
    agent {
        label 'ecs'
    }

    tools {
        maven "M3"
        nodejs "NodeJS"
    }

    options {
        buildDiscarder(logRotator(artifactNumToKeepStr: '10'))
    }

    stages {
        stage('Notify build INPROGRESS'){
            steps{
                bitbucketStatusNotify(
                buildState: 'INPROGRESS',
                commitId: '${GIT_COMMIT}'
                )
            }
        }

        stage('build') {
            stages{
                stage('Microservices build') {
                    steps {
                        sh "mvn -am -pl :libs clean package"
                        sh "mvn com.coveo:fmt-maven-plugin:format"
                        sh "mvn clean package"
                        sh "mvn com.coveo:fmt-maven-plugin:check"
                    }

                    post {
                        success {
                            junit allowEmptyResults: true, testResults: '**/target/surefire-reports/*.xml'
                            //Skip for now as we are only concern on the jenkins build, may need to enable again in the future
                            //archiveArtifacts 'libs/target/*.jar'
                            //archiveArtifacts 'microservices/**/target/*.jar'
                        }
                        failure {
                            bitbucketStatusNotify(
                                buildState: 'FAILED',
                                commitId: '${GIT_COMMIT}'
                            )
                        }
                    }
                }

                stage('App build') {
                    //agent {
                    // The mobile app build environment is defined in the following
                    // Dockerfile
                    //    dockerfile {
                    //        filename 'ci/Dockerfile.cdrb-flow-app'
                    //    }
                    //}

                    steps {
                        dir('cdrb-flow-app') {
                            script{
                                try {
                                    // sh 'yarn build'
                                    echo "skip yarn build"
                                } catch (err) {
                                    echo "Do yarn install"
                                    // sh 'yarn install'
                                    echo "Retry yarn build"
                                    // sh 'yarn build'
                                }
                            }
                        }
                    }

                    post {
                        failure {
                            bitbucketStatusNotify(
                                buildState: 'FAILED',
                                commitId: '${GIT_COMMIT}'
                            )
                        }
                    }
                }

                stage('Backoffice build') {
                    steps {
                        dir('cdrb-backoffice-web') {
                            sh 'yarn'
                            sh 'yarn generate'
                            sh 'yarn lint'
                            // sh 'yarn build'
                        }
                    }

                    post {
                        failure {
                            bitbucketStatusNotify(
                                buildState: 'FAILED',
                                commitId: '${GIT_COMMIT}'
                            )
                        }
                    }
                }
            }
        }

        stage('Notify build COMPLETED'){
            steps{
                bitbucketStatusNotify(
                    buildState: 'SUCCESSFUL',
                    commitId: '${GIT_COMMIT}'
                )
            }
        }

        stage('Merge branch if master'){
            when{
                expression {
            	    env.GIT_BRANCH == 'master'
            	}
            }

            steps {
                build job: 'merge-master-to-develop'
            }
        }
    }

    post {
        always {
            script {
                currentBuild.result = currentBuild.result ?: 'SUCCESS'
                notifyBitbucket()
            }
        }
    }

}
