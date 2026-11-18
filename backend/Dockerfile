FROM golang:1.25-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /out/api ./cmd/api

FROM alpine:3.22
RUN addgroup -S api && adduser -S api -G api
USER api
COPY --from=build /out/api /api
COPY db/migrations /migrations
EXPOSE 8080
ENTRYPOINT ["/api"]
