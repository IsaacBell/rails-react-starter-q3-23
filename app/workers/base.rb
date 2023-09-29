# frozen_string_literal: true

module Workers
  class Base
    include Sidekiq::Worker

    sidekiq_options lock: :until_executed

    def enqueue(*args)
      perform(*args)
    rescue StandardError => e
      Bugsnag.notify(e)
    end

    class << self
      def in_test_mode?
        Rails.env.test?
      end

      def launch(worker, *args)
        log_launched(worker, *args)
        if in_test_mode?
          worker.perform(*args) # Execute synchronously in test environment
        else
          worker.perform_async(*args) # Execute asynchronously otherwise
        end
        log_finished(worker, *args)
      end

      def launch_at(time, worker, *args)
        log_launched(worker, *args)
        if in_test_mode?
          worker.perform(*args) # Execute in real time in test suite
        else
          worker.perform_at(time, *args) # Execute asynchronously otherwise
        end
        log_finished(worker, *args)
      end

      def launch_in(time, worker, *args)
        launch_at(time, worker, *args)
      end

      def perform(*args)
        new.perform(*args)
      end

      protected

      def log_launched(worker, *args)
        # Send an email or back end notification that our
        # process is now running
      end

      def log_finished(worker, *args)
        # Send an email or back end notification that our
        # process has finished running
      end
    end
  end
end
