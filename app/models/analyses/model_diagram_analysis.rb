class Analyses::ModelDiagramAnalysis < ActiveRecord::Base
  has_one :report

  validates :report, presence: true

  # Creates a new VMConnection to generate project JSON data.
  # Returns true if json_data attributes is present.
  def run

    @connection = VMConnection.new(report)
    
    model_descriptions = read_model_description()

    json_data = JSON.parse(@connection.generate_files_and_read_json)

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

  def read_model_description
    models_path = 'repository/app/models'
    files_path = models_path + '/**/*.rb'
    files = @connection.read_files_in_folder(files_path)

    result = {}

    files.each do |f|
      filepath = f
      filename = f.remove(models_path + '/')
      modelname = filename.chomp('.rb').camelize
      result[modelname] = extract_description_from_file(filepath)
    end

    return result
  end

  def extract_description_from_file(filepath) 
    comment_started = false
    result = []

    @connection.read_content_of_file(filepath).each do |line|
      
      # Description should look like this:
      # 
      #    # == Description
      #    # This is a Description
      #    # Seconod line of the description
      #    # 
      #

      if(line =~ /\s*#\s*==\s*Description\s*/)
          comment_started = true
      elsif(comment_started && line =~ /\s*#/)
          # Comment text    
          cleaned_line = line.remove("#").lstrip.chomp
          
          result.push(cleaned_line) if !cleaned_line.blank?
    
      else
          comment_started = false
      end
    end

    return result
end
end
