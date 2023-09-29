module JsonRenderable
  def self.included(base)
    base.extend(ClassMethods)
  end

  module ClassMethods
    def render_json_for(actions)
      actions.each do |action_name, variable_name|
        define_method(action_name) do
          get = ->(name) { instance_variable_get("@#{name}") }
          set = ->(name, val) { instance_variable_set("@#{name}", val) }

          instance_variable = get.call(variable_name).presence ||
                              set.call(variable_name, send(action_name))
          render json: instance_variable
        end
      end
    end
  end
end
