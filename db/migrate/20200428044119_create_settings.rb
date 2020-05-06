class CreateSettings < ActiveRecord::Migration[6.0]
    def change
        create_table :settings do |a|
            a.integer :user_id
            a.boolean :location_share
            a.boolean :ferries
            a.boolean :tolls
            a.boolean :highways
        end
    end
end