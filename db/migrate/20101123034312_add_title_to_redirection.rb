class AddTitleToRedirection < ActiveRecord::Migration
  def self.up
    add_column :redirections, :title, :string
  end

  def self.down
    remove_column :redirections, :title
  end
end
