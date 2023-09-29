require 'rails_helper'

RSpec.describe Command, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:command_text) }
    it { should validate_presence_of(:model_name) }
    it { should validate_presence_of(:object_type) }
    it { should validate_presence_of(:instructions) }
    it { should validate_inclusion_of(:active).in_array([true, false]) }
    it { should belong_to(:user) }

    it 'is valid with a correct bbox format' do
      command = build(:command, bbox: [-73.95177, 40.81294, -73.947552, 40.8214875])
      expect(command).to be_valid
    end

    it 'is invalid with an incorrect bbox format' do
      command = build(:command, bbox: [-73.95177, 'invalid', -73.947552, 40.8214875])
      expect(command).not_to be_valid
      expect(command.errors[:bbox]).to include('coordinates must be numeric')
    end
  end

  describe 'search methods' do
    let(:bbox) { [-73.95177, 40.81294, -73.947552, 40.8214875] }
    let(:command) { create(:command, bbox:) }

    describe '.search' do
      it 'returns commands within the bounding box' do
        result = Command.search(bbox:)
        expect(result).to include(command)
      end
    end

    describe '.search_field' do
      it 'returns commands matching the field query' do
        result = Command.search_field('command_text', command.command_text)
        expect(result).to include(command)
      end
    end

    describe '.search_with_other_models' do
      it 'returns commands matching the query across multiple models' do
        other_model = create(:other_model)
        result = Command.search_with_other_models(command.command_text, [other_model])
        expect(result).to include(command)
      end
    end
  end

  describe '#as_indexed_json' do
    let(:command) { create(:command) }

    it 'returns the correct JSON representation for indexing' do
      expected_json = command.as_json(
        only: %i[command_text model_name object_type instructions location active custom_data]
      )
      expect(command.as_indexed_json).to eq(expected_json)
    end
  end

  describe '#bbox' do
    let(:bbox) { [-73.95177, 40.81294, -73.947552, 40.8214875] }
    let(:command) { create(:command, bbox:) }

    it 'returns the bounding box' do
      expect(command.bbox).to eq(bbox)
    end
  end
end
