Buro::Application.routes.draw do
  resources :redirections
  match '/:permalink' => 'redirections#redirect', :permalink => /[A-Za-z0-9_]{6,32}/
  match '*path'  => "home#index"
  root :to => "home#index"
end
