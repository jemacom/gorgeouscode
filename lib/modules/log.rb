module Log
  def self.info(*lines)
    first = lines[0].yellow.bold.on_blue
    tail  = lines[1..-1].inject("") { |r,line| r + "\n  " + line.yellow.bold.on_blue }
    Rails.logger.info(first + tail)
  end

  def self.error(*lines)
    first = lines[0].white.bold.on_red
    tail  = lines[1..-1].inject("") { |r,line| r + "\n  " + line.white.bold.on_red }
    Rails.logger.error(first + tail)
  end
end
