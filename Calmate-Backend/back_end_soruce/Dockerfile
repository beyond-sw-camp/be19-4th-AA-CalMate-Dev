
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY build/libs/*.jar ./
RUN mv $(ls *.jar | grep -v plain) app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

