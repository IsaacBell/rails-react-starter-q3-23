# frozen_string_literal: true

# Runs client-supplied code in as safe an environment as possible
# We can spin up these sandboxes in containers to further isolate them
class Sandbox
  attr_reader :command, :result, :safety_level

  instance_methods.each do |name|
    class_eval do
      unless name =~ /^__|^instance_eval$|^binding$|^object_id$/
        undef_method name # remove all methods
      end
    end
  end

  def initialize(command:, safety_level: 4)
    @command = command.untaint
    @safety_level = safety_level
  end

  def self.run(command:, safety_level: 4)
    new(command:, safety_level:).execute
  end

  def execute
    @result ||= proc do
      $SAFE = safety_level
      instance_eval do
        binding
      end.eval(command)
    end.call

    @result
  end
end
