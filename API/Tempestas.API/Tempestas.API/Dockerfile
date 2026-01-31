FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy all project files
COPY ["API/Tempestas.API/Tempestas.API.csproj", "API/Tempestas.API/"]
COPY ["Tempestas.Data/Tempestas.Data.csproj", "Tempestas.Data/"]
COPY ["Tempestas.Data.Models/Tempestas.Data.Models.csproj", "Tempestas.Data.Models/"]
COPY ["Tempestas.MainData/Tempestas.MainData.csproj", "Tempestas.MainData/"]
COPY ["Tempestas.Services.Core/Tempestas.Services.Core.csproj", "Tempestas.Services.Core/"]

# Restore dependencies
RUN dotnet restore "API/Tempestas.API/Tempestas.API.csproj"

# Copy everything else
COPY . .

# Build
WORKDIR "/src/API/Tempestas.API"
RUN dotnet build "Tempestas.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Tempestas.API.csproj" -c Release -o /app/publish

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tempestas.API.dll"]