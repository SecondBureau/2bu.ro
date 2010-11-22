class RedirectionsController < ApplicationController

  def index
    @redirections = Redirection.order('updated_at desc')
  end

  def show
    @redirection = Redirection.find(params[:id])
  end

  def new
    @redirection = Redirection.new
  end

  def edit
    @redirection = Redirection.find(params[:id])
  end

  def create
    @redirection = Redirection.new(params[:redirection])
    if @redirection.save
      redirect_to(@redirection, :notice => 'Redirection was successfully created.')
    else
      render :action => "new"
    end
  end

  def update
    @redirection = Redirection.find(params[:id])
    if @redirection.update_attributes(params[:redirection])
      redirect_to(@redirection, :notice => 'Redirection was successfully updated.')
    else
      render :action => "edit"
    end
  end
  
  def destroy
    @redirection = Redirection.find(params[:id])
    @redirection.destroy
    redirect_to redirections_path
  end
 
  def redirect
    @redirection = Redirection.find_by_permalink(params[:permalink])
    if @redirection.nil?
      redirect_to('/', :notice => "Permalink not found")
    else
      @redirection.visits_count += 1
      @redirection.save
      redirect_to @redirection.url, { :status => 301 }
    end
  end

end
