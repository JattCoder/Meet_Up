class CreateNavigation < ActiveRecord::Migration[6.0]
    def change
        create_table :navigations do |a|
            a.integer :user_id
            a.string :startpoint
            a.string :endpoint
            a.float :startgeo
            a.float :endgeo
            a.float :distance
            a.string :duration
        end
    end
end