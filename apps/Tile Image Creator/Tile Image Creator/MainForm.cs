using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using Nejo.Libraries.Util;

namespace Nejo.Applications.TileImageCreator {
	//nothing here is optimized
	public partial class MainForm : Form {



		
		private Bitmap bmp;
		private string svg;




		public MainForm() {
			InitializeComponent();
			Render();
		}




		public PngSvgImage Draw() {
			var lightness = (int)nudColor.Value;
			int bg = (int)nudBackground.Value;
			Color color = Color.FromArgb(lightness, lightness, lightness);
			Color bgColor = Color.FromArgb(bg, bg, bg);
			return Draw(
				(int)nudWidth.Value,
				(int)nudHeight.Value,
				(int)nudBlockWidth.Value,
				(int)nudBlockHeight.Value,
				(int)nudSpacing.Value,
				color,
				bgColor,
				(int)nudDarken.Value,
				(int)nudLighten.Value);
		}


		public async void Render() {
			var svgbmp = await Task.Run(() => Draw());
			this.bmp = svgbmp.Image;
			this.svg = svgbmp.Svg;
			pbx.Image = bmp;
		}


		private void SaveInternal(string path, ImageType type) {
			if (type == ImageType.PNG) {
				if (!path.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
					path += ".png";
				if (bmp == null) throw new ArgumentException("Image does not exist anymore.");
				bmp.Save(path, System.Drawing.Imaging.ImageFormat.Png);
			} else if(type == ImageType.SVG) {
				if (!path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase))
					path += ".svg";
				if (svg == null) throw new ArgumentException("Image does not exist anymore.");
				File.WriteAllText(path, svg, Encoding.UTF8);
			} else {
				throw new ArgumentException("Invalid Image type", nameof(type));
			}
		}


		public void Save(ImageType type) {
			if (bmp == null || svg == null) {
				MessageBox.Show(this, "Please render an image.", "No image available", MessageBoxButtons.OK, MessageBoxIcon.Error);
				return;
			}

			var path = txtOutput.Text.Trim();
			if(path.Length == 0) {
				MessageBox.Show(this, "Please specify an output path.", "No output path", MessageBoxButtons.OK, MessageBoxIcon.Error);
				return;
			}

			var parent = path.GetBeforeLast('\\');

			try {
				if (!(parent == null || parent.Length == 0))
					Directory.CreateDirectory(parent);
				SaveInternal(path, type);
			} catch (Exception ex) {
				MessageBox.Show(this, "An error occurred: " + ex.Message, "An error occurred", MessageBoxButtons.OK, MessageBoxIcon.Error);
			}
		}




		public static PngSvgImage Draw(int xCount, int yCount, int blockWidth, int blockHeight, int spacing, Color color, Color bgColor, int maxDarkenAmount, int maxLightenAmount) {
			if (xCount <= 0 || yCount <= 0 || blockWidth <= 0 || blockHeight <= 0 || spacing <= 0) throw new ArgumentException();
			var imageWidth = (xCount * blockWidth) + (xCount * spacing);
			var imageHeight = (yCount * blockHeight) + (yCount * spacing);
			var rand = new Random();
			int borderLeft = spacing / 2; //also top
			int borderRight = spacing - borderLeft; //also bottom
			int wb = blockWidth + spacing;
			int hb = blockHeight + spacing;

			StringBuilder sb = new StringBuilder();
			sb.Append("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
			sb.Append("<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">");
			sb.Append($"<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" width=\"{imageWidth}\" height=\"{imageHeight}\">");
			sb.Append($"<rect width=\"{imageWidth}\" height=\"{imageHeight}\" style=\"fill: rgb({bgColor.R}, {bgColor.G}, {bgColor.B})\" />");

			Color[,] colors = new Color[xCount, yCount];
			for (int x = 0; x < xCount; x++) {
				for (int y = 0; y < yCount; y++) {
					var c =  GetRandomSimilarColor(color, rand, maxDarkenAmount, maxLightenAmount);
					colors[x, y] = c;
					int xx = borderLeft + (x * wb);
					int yy = borderLeft + (y * hb);
					sb.Append($"<rect x=\"{xx}\" y=\"{yy}\" width=\"{blockWidth}\" height=\"{blockHeight}\" style=\"fill: rgb({c.R}, {c.G}, {c.B})\" />");
                }
			}

			sb.Append("</svg>");

			var bitmap = new Bitmap(imageWidth, imageHeight);
			for (int x = 0; x < imageWidth; x++) {
				for (int y = 0; y < imageHeight; y++) {
					if (x < borderLeft || y < borderLeft) {
						bitmap.SetPixel(x, y, bgColor);
						continue;
					}
					var nx = (x - borderLeft) % wb;
					var ny = (y - borderLeft) % hb;
					var nxs = (x - borderLeft) / wb;
					var nys = (y - borderLeft) / hb;
					if (nx < blockWidth && ny < blockHeight) {
						bitmap.SetPixel(x, y, colors[nxs, nys]);
						continue;
					}
					bitmap.SetPixel(x, y, bgColor);
				}
			}

			return new PngSvgImage(sb.ToString(), bitmap);
		}


		private static Color GetRandomSimilarColor(Color color, Random randomizer, int maxDarkenAmount, int maxLightenAmount) {
			var i = randomizer.Next(-maxDarkenAmount, maxLightenAmount + 1);
			if (i == 0) return color;
			int r = color.R,
				g = color.G,
				b = color.B;
			r += i;
			g += i;
			b += i;
			if (r < 0) r = 0;
			if (g < 0) g = 0;
			if (b < 0) b = 0;
			if (r > 255) r = 255;
			if (g > 255) g = 255;
			if (b > 255) b = 255;
			return Color.FromArgb(r, g, b);
		}




		private void btnRender_Click(object sender, EventArgs e) {
			Render();
		}


		private void nud_ValueChanged(object sender, EventArgs e) {
			Render();
		}


		private void btnOutput_Click(object sender, EventArgs e) {
			if (sfd.ShowDialog() == DialogResult.OK) {
				var path = sfd.FileName;
				if (path.EndsWith(".png", StringComparison.OrdinalIgnoreCase))
					path = path.Substring(0, path.Length - 4);
				else if (path.EndsWith(".svg", StringComparison.OrdinalIgnoreCase))
					path = path.Substring(0, path.Length - 4);
				txtOutput.Text = path;
			}
		}


		private void btnSavePng_Click(object sender, EventArgs e) {
			Save(ImageType.PNG);
		}


		private void btnSaveSvg_Click(object sender, EventArgs e) {
			Save(ImageType.SVG);
		}




	}







	public struct PngSvgImage {


		public string Svg {
			get; private set;
		}

		public Bitmap Image {
			get; private set;
		}

		public bool IsEmpty => Svg == null && Image == null;


		public PngSvgImage(string svg, Bitmap image) {
			if (svg == null) throw new ArgumentNullException(nameof(svg));
			if (image == null) throw new ArgumentNullException(nameof(image));
			this.Svg = svg;
			this.Image = image;
		}


	}




	public enum ImageType {
		PNG,
		SVG
	}








}