require 'uri'

class Redirection < ActiveRecord::Base
  
  PERMALINK_LENGTH = 6
  PERMALINK_CHARS = 'abcdefghijklmnopqrstuvwxyz1234567890_'
  
  before_validation :unique_permalink
  before_validation :locked_unless_recent
  validates_format_of :permalink, :with => /\A[A-Za-z0-9_]{6,32}\Z/, :message => "6 to 30 letters or numbers only"
  validates_uri_existence_of :url, :with => /(^$)|(^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$)/ix
  before_save :set_default_values
  before_destroy :is_recent?
  
private
  
  def permalink_exists?
    permalink.blank? || (id.nil? ? Redirection.exists?(:permalink => permalink) : Redirection.exists?(['permalink = ? and id <> ?', permalink, id]))
  end
  
  def is_recent?
    created_at.nil? || created_at > 15.minutes.ago
  end
  
  def locked_unless_recent
    unless is_recent?
      r = Redirection.find(id)
      self.permalink = r.permalink
      self.url = r.url
    end
  end
  
  def unique_permalink
    self.permalink ||= ''
    while permalink.length < PERMALINK_LENGTH || permalink_exists? do
      self.permalink << PERMALINK_CHARS[rand(PERMALINK_CHARS.length)]
    end
  end
  
  def set_default_values
    self.visits_count ||= 0
  end
  
end
