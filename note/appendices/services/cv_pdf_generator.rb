# cv_pdf_generator.rb

require 'render_anywhere'
require 'tempfile'

class CvPdfGenerator
  include RenderAnywhere

  def initialize(cv_info)
    @cv = cv_info
  end

  def to_pdf
    header = header_file
    kit = PDFKit.new(
      cv_body,
      header_html: header.path,
      margin_bottom: '0mm',
      margin_left: '0mm',
      margin_right: '10mm',
      margin_top: '45mm'
    )
    cv = Tempfile.new(['cv', '.pdf'])
    kit.to_file(cv.path)
    cv
  end

  private

  def cv_body
    render template: 'cv/show', layout: 'cv', locals: { cv: @cv }
  end

  def cv_header
    render template: 'cv/_header', layout: 'cv', locals: { cv: @cv }
  end

  def header_file
    header = Tempfile.new(['header', '.html'])
    header.write(cv_header)
    header.close
    header
  end
end
