class User < ApplicationRecord
  attr_writer :login
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable,:rememberable, :validatable,:lockable,:timeoutable, :trackable, authentication_keys: [:username]

  def login
    @login || self.username
  end
end
