# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_04_28_044119) do

  create_table "favorites", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "address"
    t.float "latitude"
    t.float "longitude"
  end

  create_table "maps", force: :cascade do |t|
    t.integer "user_id"
    t.string "name"
    t.string "address"
    t.float "latitude"
    t.float "longitude"
  end

  create_table "navigations", force: :cascade do |t|
    t.integer "user_id"
    t.string "startpoint"
    t.string "endpoint"
    t.float "startgeo"
    t.float "endgeo"
    t.float "distance"
    t.string "duration"
  end

  create_table "settings", force: :cascade do |t|
    t.integer "user_id"
    t.string "location_share"
    t.boolean "ferries"
    t.boolean "tolls"
    t.boolean "highways"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

end
