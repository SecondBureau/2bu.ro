class CreateRedirections < ActiveRecord::Migration
  def self.up
    create_table :redirections do |t|
      t.string :url
      t.string :permalink
      t.integer :visits_count, :default => 0
      t.timestamps
    end
    
    add_index :redirections, :permalink, :unique => true
    
  end

  def self.down
    drop_table :redirections
  end
end
