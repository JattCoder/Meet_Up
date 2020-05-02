class CreateMaps < ActiveRecord::Migration[6.0]
    def change
        create_table :maps do |a|
            a.integer :user_id
            a.string :name
            a.string :address
            a.float :latitude
            a.float :longitude
        end
    end
end