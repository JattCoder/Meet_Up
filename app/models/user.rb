class User < ApplicationRecord
    has_secure_password

    def self.from_omniauth(auth)
      byebug
      where(email: auth.info.email).first_or_initialize do |user|
        user.name = auth.info.name
        user.email = auth.info.email
        user.password = SecureRandom.hex
      end
    end
end
