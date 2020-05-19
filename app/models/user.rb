class User < ApplicationRecord
    has_many :favorites
    has_one :setting
end
