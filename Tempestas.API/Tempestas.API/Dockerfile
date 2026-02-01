FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files
COPY ["Tempestas.API/Tempestas.API.csproj", "Tempestas.API/"]
COPY ["Tempestas.Data/Tempestas.Data.csproj", "Tempestas.Data/"]
COPY ["Tempestas.Data.Models/Tempestas.Data.Models.csproj", "Tempestas.Data.Models/"]
COPY ["Tempestas.MainData/Tempestas.MainData.csproj", "Tempestas.MainData/"]
COPY ["Tempestas.Services.Core/Tempestas.Services.Core.csproj", "Tempestas.Services.Core/"]

# Restore
RUN dotnet restore "Tempestas.API/Tempestas.API.csproj"

# Copy everything
COPY . .

# Build
WORKDIR "/src/Tempestas.API"
RUN dotnet build "Tempestas.API.csproj" -c Release -o /app/build

# Publish
FROM build AS publish
RUN dotnet publish "Tempestas.API.csproj" -c Release -o /app/publish

# Final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Tempestas.API.dll"]