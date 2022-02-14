namespace Nejo.Applications.TileImageCreator {
	partial class MainForm {
		/// <summary>
		/// Required designer variable.
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// Clean up any resources being used.
		/// </summary>
		/// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
		protected override void Dispose(bool disposing) {
			if (disposing && (components != null)) {
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows Form Designer generated code

		/// <summary>
		/// Required method for Designer support - do not modify
		/// the contents of this method with the code editor.
		/// </summary>
		private void InitializeComponent() {
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
			this.gbxSettings = new System.Windows.Forms.GroupBox();
			this.btnRender = new System.Windows.Forms.Button();
			this.btnSaveSvg = new System.Windows.Forms.Button();
			this.btnSavePng = new System.Windows.Forms.Button();
			this.lblBlockHeight = new System.Windows.Forms.Label();
			this.lblHeight = new System.Windows.Forms.Label();
			this.lblSpacing = new System.Windows.Forms.Label();
			this.lblBlockWidth = new System.Windows.Forms.Label();
			this.lblBackground = new System.Windows.Forms.Label();
			this.lblColor = new System.Windows.Forms.Label();
			this.lblDarken = new System.Windows.Forms.Label();
			this.lblLighten = new System.Windows.Forms.Label();
			this.lblWidth = new System.Windows.Forms.Label();
			this.nudBlockHeight = new System.Windows.Forms.NumericUpDown();
			this.nudHeight = new System.Windows.Forms.NumericUpDown();
			this.nudSpacing = new System.Windows.Forms.NumericUpDown();
			this.nudBlockWidth = new System.Windows.Forms.NumericUpDown();
			this.nudBackground = new System.Windows.Forms.NumericUpDown();
			this.nudColor = new System.Windows.Forms.NumericUpDown();
			this.nudDarken = new System.Windows.Forms.NumericUpDown();
			this.nudLighten = new System.Windows.Forms.NumericUpDown();
			this.nudWidth = new System.Windows.Forms.NumericUpDown();
			this.lblOutput = new System.Windows.Forms.Label();
			this.btnOutput = new System.Windows.Forms.Button();
			this.txtOutput = new System.Windows.Forms.TextBox();
			this.sfd = new System.Windows.Forms.SaveFileDialog();
			this.pbx = new System.Windows.Forms.PictureBox();
			this.gbxSettings.SuspendLayout();
			((System.ComponentModel.ISupportInitialize)(this.nudBlockHeight)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudHeight)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudSpacing)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudBlockWidth)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudBackground)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudColor)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudDarken)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudLighten)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.nudWidth)).BeginInit();
			((System.ComponentModel.ISupportInitialize)(this.pbx)).BeginInit();
			this.SuspendLayout();
			// 
			// gbxSettings
			// 
			this.gbxSettings.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.gbxSettings.Controls.Add(this.btnRender);
			this.gbxSettings.Controls.Add(this.btnSaveSvg);
			this.gbxSettings.Controls.Add(this.btnSavePng);
			this.gbxSettings.Controls.Add(this.lblBlockHeight);
			this.gbxSettings.Controls.Add(this.lblHeight);
			this.gbxSettings.Controls.Add(this.lblSpacing);
			this.gbxSettings.Controls.Add(this.lblBlockWidth);
			this.gbxSettings.Controls.Add(this.lblBackground);
			this.gbxSettings.Controls.Add(this.lblColor);
			this.gbxSettings.Controls.Add(this.lblDarken);
			this.gbxSettings.Controls.Add(this.lblLighten);
			this.gbxSettings.Controls.Add(this.lblWidth);
			this.gbxSettings.Controls.Add(this.nudBlockHeight);
			this.gbxSettings.Controls.Add(this.nudHeight);
			this.gbxSettings.Controls.Add(this.nudSpacing);
			this.gbxSettings.Controls.Add(this.nudBlockWidth);
			this.gbxSettings.Controls.Add(this.nudBackground);
			this.gbxSettings.Controls.Add(this.nudColor);
			this.gbxSettings.Controls.Add(this.nudDarken);
			this.gbxSettings.Controls.Add(this.nudLighten);
			this.gbxSettings.Controls.Add(this.nudWidth);
			this.gbxSettings.Controls.Add(this.lblOutput);
			this.gbxSettings.Controls.Add(this.btnOutput);
			this.gbxSettings.Controls.Add(this.txtOutput);
			this.gbxSettings.Location = new System.Drawing.Point(12, 12);
			this.gbxSettings.Name = "gbxSettings";
			this.gbxSettings.Size = new System.Drawing.Size(600, 160);
			this.gbxSettings.TabIndex = 0;
			this.gbxSettings.TabStop = false;
			this.gbxSettings.Text = "Settings";
			// 
			// btnRender
			// 
			this.btnRender.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
			this.btnRender.Location = new System.Drawing.Point(357, 131);
			this.btnRender.Name = "btnRender";
			this.btnRender.Size = new System.Drawing.Size(75, 23);
			this.btnRender.TabIndex = 5;
			this.btnRender.Text = "Re-render";
			this.btnRender.UseVisualStyleBackColor = true;
			this.btnRender.Click += new System.EventHandler(this.btnRender_Click);
			// 
			// btnSaveSvg
			// 
			this.btnSaveSvg.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
			this.btnSaveSvg.Location = new System.Drawing.Point(519, 131);
			this.btnSaveSvg.Name = "btnSaveSvg";
			this.btnSaveSvg.Size = new System.Drawing.Size(75, 23);
			this.btnSaveSvg.TabIndex = 5;
			this.btnSaveSvg.Text = "Save SVG";
			this.btnSaveSvg.UseVisualStyleBackColor = true;
			this.btnSaveSvg.Click += new System.EventHandler(this.btnSaveSvg_Click);
			// 
			// btnSavePng
			// 
			this.btnSavePng.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
			this.btnSavePng.Location = new System.Drawing.Point(438, 131);
			this.btnSavePng.Name = "btnSavePng";
			this.btnSavePng.Size = new System.Drawing.Size(75, 23);
			this.btnSavePng.TabIndex = 5;
			this.btnSavePng.Text = "Save PNG";
			this.btnSavePng.UseVisualStyleBackColor = true;
			this.btnSavePng.Click += new System.EventHandler(this.btnSavePng_Click);
			// 
			// lblBlockHeight
			// 
			this.lblBlockHeight.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.lblBlockHeight.AutoSize = true;
			this.lblBlockHeight.Location = new System.Drawing.Point(421, 76);
			this.lblBlockHeight.Name = "lblBlockHeight";
			this.lblBlockHeight.Size = new System.Drawing.Size(117, 13);
			this.lblBlockHeight.TabIndex = 4;
			this.lblBlockHeight.Text = "Block Height (in pixels):";
			// 
			// lblHeight
			// 
			this.lblHeight.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.lblHeight.AutoSize = true;
			this.lblHeight.Location = new System.Drawing.Point(229, 76);
			this.lblHeight.Name = "lblHeight";
			this.lblHeight.Size = new System.Drawing.Size(92, 13);
			this.lblHeight.TabIndex = 4;
			this.lblHeight.Text = "Height (in blocks):";
			// 
			// lblSpacing
			// 
			this.lblSpacing.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.lblSpacing.AutoSize = true;
			this.lblSpacing.Location = new System.Drawing.Point(223, 102);
			this.lblSpacing.Name = "lblSpacing";
			this.lblSpacing.Size = new System.Drawing.Size(95, 13);
			this.lblSpacing.TabIndex = 4;
			this.lblSpacing.Text = "Spacing (in pixels):";
			// 
			// lblBlockWidth
			// 
			this.lblBlockWidth.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.lblBlockWidth.AutoSize = true;
			this.lblBlockWidth.Location = new System.Drawing.Point(421, 50);
			this.lblBlockWidth.Name = "lblBlockWidth";
			this.lblBlockWidth.Size = new System.Drawing.Size(111, 13);
			this.lblBlockWidth.TabIndex = 4;
			this.lblBlockWidth.Text = "Block width (in pixels):";
			// 
			// lblBackground
			// 
			this.lblBackground.AutoSize = true;
			this.lblBackground.Location = new System.Drawing.Point(6, 128);
			this.lblBackground.Name = "lblBackground";
			this.lblBackground.Size = new System.Drawing.Size(145, 13);
			this.lblBackground.TabIndex = 4;
			this.lblBackground.Text = "Background color brightness:";
			// 
			// lblColor
			// 
			this.lblColor.AutoSize = true;
			this.lblColor.Location = new System.Drawing.Point(6, 102);
			this.lblColor.Name = "lblColor";
			this.lblColor.Size = new System.Drawing.Size(111, 13);
			this.lblColor.TabIndex = 4;
			this.lblColor.Text = "Initial color brightness:";
			// 
			// lblDarken
			// 
			this.lblDarken.AutoSize = true;
			this.lblDarken.Location = new System.Drawing.Point(6, 76);
			this.lblDarken.Name = "lblDarken";
			this.lblDarken.Size = new System.Drawing.Size(71, 13);
			this.lblDarken.TabIndex = 4;
			this.lblDarken.Text = "Max dimming:";
			// 
			// lblLighten
			// 
			this.lblLighten.AutoSize = true;
			this.lblLighten.Location = new System.Drawing.Point(6, 50);
			this.lblLighten.Name = "lblLighten";
			this.lblLighten.Size = new System.Drawing.Size(85, 13);
			this.lblLighten.TabIndex = 4;
			this.lblLighten.Text = "Max brightening:";
			// 
			// lblWidth
			// 
			this.lblWidth.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.lblWidth.AutoSize = true;
			this.lblWidth.Location = new System.Drawing.Point(229, 50);
			this.lblWidth.Name = "lblWidth";
			this.lblWidth.Size = new System.Drawing.Size(89, 13);
			this.lblWidth.TabIndex = 4;
			this.lblWidth.Text = "Width (in blocks):";
			// 
			// nudBlockHeight
			// 
			this.nudBlockHeight.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.nudBlockHeight.Location = new System.Drawing.Point(544, 74);
			this.nudBlockHeight.Maximum = new decimal(new int[] {
            512,
            0,
            0,
            0});
			this.nudBlockHeight.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
			this.nudBlockHeight.Name = "nudBlockHeight";
			this.nudBlockHeight.Size = new System.Drawing.Size(50, 20);
			this.nudBlockHeight.TabIndex = 3;
			this.nudBlockHeight.Value = new decimal(new int[] {
            16,
            0,
            0,
            0});
			this.nudBlockHeight.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudHeight
			// 
			this.nudHeight.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.nudHeight.Location = new System.Drawing.Point(327, 74);
			this.nudHeight.Maximum = new decimal(new int[] {
            512,
            0,
            0,
            0});
			this.nudHeight.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
			this.nudHeight.Name = "nudHeight";
			this.nudHeight.Size = new System.Drawing.Size(50, 20);
			this.nudHeight.TabIndex = 3;
			this.nudHeight.Value = new decimal(new int[] {
            16,
            0,
            0,
            0});
			this.nudHeight.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudSpacing
			// 
			this.nudSpacing.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.nudSpacing.Location = new System.Drawing.Point(327, 100);
			this.nudSpacing.Maximum = new decimal(new int[] {
            512,
            0,
            0,
            0});
			this.nudSpacing.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
			this.nudSpacing.Name = "nudSpacing";
			this.nudSpacing.Size = new System.Drawing.Size(50, 20);
			this.nudSpacing.TabIndex = 3;
			this.nudSpacing.Value = new decimal(new int[] {
            2,
            0,
            0,
            0});
			this.nudSpacing.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudBlockWidth
			// 
			this.nudBlockWidth.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.nudBlockWidth.Location = new System.Drawing.Point(544, 48);
			this.nudBlockWidth.Maximum = new decimal(new int[] {
            512,
            0,
            0,
            0});
			this.nudBlockWidth.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
			this.nudBlockWidth.Name = "nudBlockWidth";
			this.nudBlockWidth.Size = new System.Drawing.Size(50, 20);
			this.nudBlockWidth.TabIndex = 3;
			this.nudBlockWidth.Value = new decimal(new int[] {
            16,
            0,
            0,
            0});
			this.nudBlockWidth.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudBackground
			// 
			this.nudBackground.Location = new System.Drawing.Point(157, 126);
			this.nudBackground.Maximum = new decimal(new int[] {
            255,
            0,
            0,
            0});
			this.nudBackground.Name = "nudBackground";
			this.nudBackground.Size = new System.Drawing.Size(50, 20);
			this.nudBackground.TabIndex = 3;
			this.nudBackground.Value = new decimal(new int[] {
            36,
            0,
            0,
            0});
			this.nudBackground.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudColor
			// 
			this.nudColor.Location = new System.Drawing.Point(157, 100);
			this.nudColor.Maximum = new decimal(new int[] {
            255,
            0,
            0,
            0});
			this.nudColor.Name = "nudColor";
			this.nudColor.Size = new System.Drawing.Size(50, 20);
			this.nudColor.TabIndex = 3;
			this.nudColor.Value = new decimal(new int[] {
            36,
            0,
            0,
            0});
			this.nudColor.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudDarken
			// 
			this.nudDarken.Location = new System.Drawing.Point(157, 74);
			this.nudDarken.Maximum = new decimal(new int[] {
            255,
            0,
            0,
            0});
			this.nudDarken.Minimum = new decimal(new int[] {
            255,
            0,
            0,
            -2147483648});
			this.nudDarken.Name = "nudDarken";
			this.nudDarken.Size = new System.Drawing.Size(50, 20);
			this.nudDarken.TabIndex = 3;
			this.nudDarken.Value = new decimal(new int[] {
            6,
            0,
            0,
            0});
			this.nudDarken.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudLighten
			// 
			this.nudLighten.Location = new System.Drawing.Point(157, 48);
			this.nudLighten.Maximum = new decimal(new int[] {
            255,
            0,
            0,
            0});
			this.nudLighten.Minimum = new decimal(new int[] {
            255,
            0,
            0,
            -2147483648});
			this.nudLighten.Name = "nudLighten";
			this.nudLighten.Size = new System.Drawing.Size(50, 20);
			this.nudLighten.TabIndex = 3;
			this.nudLighten.Value = new decimal(new int[] {
            6,
            0,
            0,
            0});
			this.nudLighten.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// nudWidth
			// 
			this.nudWidth.Anchor = System.Windows.Forms.AnchorStyles.Top;
			this.nudWidth.Location = new System.Drawing.Point(327, 48);
			this.nudWidth.Maximum = new decimal(new int[] {
            512,
            0,
            0,
            0});
			this.nudWidth.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
			this.nudWidth.Name = "nudWidth";
			this.nudWidth.Size = new System.Drawing.Size(50, 20);
			this.nudWidth.TabIndex = 3;
			this.nudWidth.Value = new decimal(new int[] {
            16,
            0,
            0,
            0});
			this.nudWidth.ValueChanged += new System.EventHandler(this.nud_ValueChanged);
			// 
			// lblOutput
			// 
			this.lblOutput.AutoSize = true;
			this.lblOutput.Location = new System.Drawing.Point(6, 24);
			this.lblOutput.Name = "lblOutput";
			this.lblOutput.Size = new System.Drawing.Size(82, 13);
			this.lblOutput.TabIndex = 2;
			this.lblOutput.Text = "Output location:";
			// 
			// btnOutput
			// 
			this.btnOutput.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
			this.btnOutput.Location = new System.Drawing.Point(519, 19);
			this.btnOutput.Name = "btnOutput";
			this.btnOutput.Size = new System.Drawing.Size(75, 23);
			this.btnOutput.TabIndex = 1;
			this.btnOutput.Text = "Browse...";
			this.btnOutput.UseVisualStyleBackColor = true;
			this.btnOutput.Click += new System.EventHandler(this.btnOutput_Click);
			// 
			// txtOutput
			// 
			this.txtOutput.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.txtOutput.Location = new System.Drawing.Point(137, 21);
			this.txtOutput.Name = "txtOutput";
			this.txtOutput.Size = new System.Drawing.Size(376, 20);
			this.txtOutput.TabIndex = 0;
			this.txtOutput.Text = "tiles";
			// 
			// sfd
			// 
			this.sfd.AddExtension = false;
			this.sfd.Filter = "PNG Images|*.png|SVG Vector Images|*.svg|All Files|*";
			// 
			// pbx
			// 
			this.pbx.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
			this.pbx.Location = new System.Drawing.Point(12, 178);
			this.pbx.Name = "pbx";
			this.pbx.Size = new System.Drawing.Size(600, 151);
			this.pbx.SizeMode = System.Windows.Forms.PictureBoxSizeMode.Zoom;
			this.pbx.TabIndex = 1;
			this.pbx.TabStop = false;
			// 
			// MainForm
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(624, 341);
			this.Controls.Add(this.pbx);
			this.Controls.Add(this.gbxSettings);
			this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
			this.MinimumSize = new System.Drawing.Size(640, 380);
			this.Name = "MainForm";
			this.Text = "Tile Image Creator";
			this.gbxSettings.ResumeLayout(false);
			this.gbxSettings.PerformLayout();
			((System.ComponentModel.ISupportInitialize)(this.nudBlockHeight)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudHeight)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudSpacing)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudBlockWidth)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudBackground)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudColor)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudDarken)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudLighten)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.nudWidth)).EndInit();
			((System.ComponentModel.ISupportInitialize)(this.pbx)).EndInit();
			this.ResumeLayout(false);

		}

		#endregion

		private System.Windows.Forms.GroupBox gbxSettings;
		private System.Windows.Forms.Label lblBlockHeight;
		private System.Windows.Forms.Label lblHeight;
		private System.Windows.Forms.Label lblSpacing;
		private System.Windows.Forms.Label lblBlockWidth;
		private System.Windows.Forms.Label lblWidth;
		private System.Windows.Forms.NumericUpDown nudBlockHeight;
		private System.Windows.Forms.NumericUpDown nudHeight;
		private System.Windows.Forms.NumericUpDown nudSpacing;
		private System.Windows.Forms.NumericUpDown nudBlockWidth;
		private System.Windows.Forms.NumericUpDown nudWidth;
		private System.Windows.Forms.Label lblOutput;
		private System.Windows.Forms.Button btnOutput;
		private System.Windows.Forms.TextBox txtOutput;
		private System.Windows.Forms.SaveFileDialog sfd;
		private System.Windows.Forms.Button btnRender;
		private System.Windows.Forms.Button btnSavePng;
		private System.Windows.Forms.PictureBox pbx;
		private System.Windows.Forms.Button btnSaveSvg;
		private System.Windows.Forms.Label lblColor;
		private System.Windows.Forms.Label lblDarken;
		private System.Windows.Forms.Label lblLighten;
		private System.Windows.Forms.NumericUpDown nudColor;
		private System.Windows.Forms.NumericUpDown nudDarken;
		private System.Windows.Forms.NumericUpDown nudLighten;
		private System.Windows.Forms.Label lblBackground;
		private System.Windows.Forms.NumericUpDown nudBackground;
	}
}

