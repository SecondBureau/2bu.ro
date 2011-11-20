Buro::Application.routes.draw do
  resources :redirections
  match '/newrelic_2buro' => 'redirections#newrelic'
  match '/whoami' => 'redirections#whoami'
  match '/:permalink' => 'redirections#redirect', :permalink => /[A-Za-z0-9_]{4,32}/
  match '/indirect/:permalink' => 'redirections#indirect', :permalink => /[A-Za-z0-9_]{4,32}/, :constraints => { :user_agent => /SecondBureau Redirector/ } 
  match '/squid/:proxy' => 'redirections#squid'
  match '*path'  => "home#index"
  root :to => "home#index"
end
