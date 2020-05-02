Rails.application.config.middleware.use OmniAuth::Builder do
    Dotenv.load
    provider :google_oauth2, Rails.application.credentials.production[:client_id],Rails.application.credentials.production[:secret_id], skip_jwt: true
end