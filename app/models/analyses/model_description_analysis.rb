class Analyses::ModelDescriptionAnalysis

  def initialize(report)
    @report = report
  end

  # Creates a new VMConnection to generate project JSON data.
  def run
    connection = VMConnection.new(@report)
    return connection.read_model_description
  end

  
end
