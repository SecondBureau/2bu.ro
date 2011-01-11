Buro::Application.routes.draw do
  resources :redirections
  match '/newrelic_2buro' => 'redirections#newrelic'
  match '/:permalink' => 'redirections#redirect', :permalink => /[A-Za-z0-9_]{6,32}/
  match '/indirect/:permalink' => 'redirections#indirect', :permalink => /[A-Za-z0-9_]{6,32}/, :constraints => { :user_agent => /SecondBureau Redirector/ } 
  match '*path'  => "home#index"
  root :to => "home#index"
end
