# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Analysis::Azure, type: :model do
  let(:text) { 'Your sample text here.' }
  let(:analysis) { Analysis::Azure.new }

  describe '#analyze_sentiment' do
    it 'updates the sentiment fields' do
      VCR.use_cassette('azure_analyze_sentiment') do
        analysis.analyze_sentiment(text)
        expect(analysis.sentiment_score_positive).to be_a(Float)
        # Add more expectations for other fields as needed
      end
    end
  end

  # Similar tests for other methods
end
