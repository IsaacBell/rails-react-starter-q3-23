# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Analysis::Gcp, type: :model do
  let(:text) { 'Your sample text here.' }
  let(:analysis) { Analysis::Gcp.new }

  describe '#analyze_sentiment' do
    it 'updates the sentiment fields' do
      VCR.use_cassette('gcp_analyze_sentiment') do
        analysis.analyze_sentiment(text)
        expect(analysis.sentiment_score).to be_a(Float)
        expect(analysis.sentiment_magnitude).to be_a(Float)
      end
    end
  end
end
