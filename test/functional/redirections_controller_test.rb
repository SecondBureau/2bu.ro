require 'test_helper'

class RedirectionsControllerTest < ActionController::TestCase
  setup do
    @redirection = redirections(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:redirections)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create redirection" do
    assert_difference('Redirection.count') do
      post :create, :redirection => @redirection.attributes
    end

    assert_redirected_to redirection_path(assigns(:redirection))
  end

  test "should show redirection" do
    get :show, :id => @redirection.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, :id => @redirection.to_param
    assert_response :success
  end

  test "should update redirection" do
    put :update, :id => @redirection.to_param, :redirection => @redirection.attributes
    assert_redirected_to redirection_path(assigns(:redirection))
  end

  test "should destroy redirection" do
    assert_difference('Redirection.count', -1) do
      delete :destroy, :id => @redirection.to_param
    end

    assert_redirected_to redirections_path
  end
end
