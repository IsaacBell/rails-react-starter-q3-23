# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Analysis::Aws, type: :model do
  let(:text) { 'Your sample text here.' }
  let(:analysis) { Analysis::Aws.new }

  describe '#analyze_sentiment' do
    it 'updates the sentiment fields' do
      VCR.use_cassette('aws_analyze_sentiment') do
        analysis.analyze_sentiment(text)
        expect(analysis.sentiment).to be_present
        expect(analysis.sentiment_score_positive).to be_a(Float)
      end
    end
  end

  # Similar tests for other methods
end
