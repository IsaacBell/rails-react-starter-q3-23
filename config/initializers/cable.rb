if Rails.env.development?
  Rails.application.config.action_cable.allowed_request_origins = ['http://localhost:5000', 'http://localhost:3000']
end
