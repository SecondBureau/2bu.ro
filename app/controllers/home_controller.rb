class HomeController < ApplicationController
  def index
    @redirection = Redirection.new
  end
end