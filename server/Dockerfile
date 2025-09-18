# server/Dockerfile

# ---------- build stage ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copy the project file(s) and restore
COPY *.csproj ./
RUN dotnet restore

# now copy the rest of the source
COPY . ./

# publish to a clean folder
RUN dotnet publish -c Release -o /app/out

# ---------- runtime stage ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# copy build output
COPY --from=build /app/out ./

# Let Render tell us which port to listen on.
# You'll set ASPNETCORE_URLS in Render env to: http://0.0.0.0:${PORT}
# (see notes below)
# EXPOSE is optional for Render, but harmless:
EXPOSE 8080

# IMPORTANT: set this to your actual DLL name (your .csproj name)
ENTRYPOINT ["dotnet", "server.dll"]