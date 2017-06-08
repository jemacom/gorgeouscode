class Analyses::ModelDiagramAnalysis < ActiveRecord::Base
  has_one :report

  validates :report, presence: true

  # Creates a new VMConnection to generate project JSON data.
  # Returns true if json_data attributes is present.
  def run
  
    model_description_analysis = Analyses::ModelDescriptionAnalysis.new(report)
    
    model_descriptions = model_description_analysis.run()

    connection = VMConnection.new(report)
    json_data = JSON.parse(connection.generate_files_and_read_json)

    json_data['models']['nodes'].each do |node|
      node['description'] = ''
      model_descriptions.each do |key, value|
        if node['name'] == key
          node['description'] = value
        end
      end
    end
 
    
    if json_data
      self.json_data = json_data.to_json
      save
      return true
    end

    false
  end
end
