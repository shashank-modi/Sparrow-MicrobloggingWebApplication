# 1) Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy csproj first to leverage Docker layer caching
COPY server/*.csproj ./ 
RUN dotnet restore

# now copy the remaining source
COPY server/. ./

# publish (self-contained build output)
RUN dotnet publish -c Release -o /app/publish

# 2) Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish ./

# Expose Kestrel port (Render provides $PORT)
ENV ASPNETCORE_URLS="http://+:${PORT:-8080}"
EXPOSE 8080

# OPTIONAL but useful: set production env
ENV ASPNETCORE_ENVIRONMENT=Production

# entrypoint
ENTRYPOINT ["dotnet", "server.dll"]
