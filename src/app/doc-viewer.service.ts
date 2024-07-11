import { Injectable } from '@angular/core';
import { Core, WebViewerInstance } from '@pdftron/webviewer';

@Injectable({
  providedIn: 'root'
})
export class DocViewerService {

  constructor() { }

  public getAnnotationToolsArray(instance: WebViewerInstance): Core.Tools.ToolNames[]{
    const tools = instance.Core.Tools.ToolNames;
    const annTools = [
      tools.UNDERLINE,
      tools.UNDERLINE2,
      tools.UNDERLINE3,
      tools.UNDERLINE4,
      tools.HIGHLIGHT,
      tools.HIGHLIGHT2,
      tools.HIGHLIGHT3,
      tools.HIGHLIGHT4,
      tools.RECTANGLE,
      tools.RECTANGLE2,
      tools.RECTANGLE3,
      tools.RECTANGLE4,
      tools.FREETEXT,
      tools.FREETEXT2,
      tools.FREETEXT3,
      tools.FREETEXT4,
      tools.FREEHAND_HIGHLIGHT,
      tools.FREEHAND_HIGHLIGHT2,
      tools.FREEHAND_HIGHLIGHT3,
      tools.FREEHAND_HIGHLIGHT4,
      tools.FREEHAND,
      tools.FREEHAND2,
      tools.FREEHAND3,
      tools.FREEHAND4,
      tools.SQUIGGLY,
      tools.SQUIGGLY2,
      tools.SQUIGGLY3,
      tools.SQUIGGLY4,
      tools.STRIKEOUT,
      tools.STRIKEOUT2,
      tools.STRIKEOUT3,
      tools.STRIKEOUT4,
      tools.MARK_INSERT_TEXT,
      tools.MARK_INSERT_TEXT2,
      tools.MARK_INSERT_TEXT3,
      tools.MARK_INSERT_TEXT4,
      tools.MARK_REPLACE_TEXT,
      tools.MARK_REPLACE_TEXT2,
      tools.MARK_REPLACE_TEXT3,
      tools.MARK_REPLACE_TEXT4,
      tools.LINE,
      tools.LINE2,
      tools.LINE3,
      tools.LINE4,
      tools.POLYLINE,
      tools.POLYLINE2,
      tools.POLYLINE3,
      tools.POLYLINE4,
      tools.ARROW,
      tools.ARROW2,
      tools.ARROW3,
      tools.ARROW4,
      tools.ELLIPSE,
      tools.ELLIPSE2,
      tools.ELLIPSE3,
      tools.ELLIPSE4,
      tools.POLYGON,
      tools.POLYGON2,
      tools.POLYGON3,
      tools.POLYGON4,
      tools.POLYGON_CLOUD,
      tools.POLYGON_CLOUD2,
      tools.POLYGON_CLOUD3,
      tools.POLYGON_CLOUD4,
      tools.STAMP,
      tools.ADD_IMAGE_CONTENT,
      //tools.FILEATTACHMENT,
      tools.CALLOUT,
      tools.CALLOUT2,
      tools.CALLOUT3,
      tools.CALLOUT4,
      tools.STICKY,
      tools.STICKY2,
      tools.STICKY3,
      tools.STICKY4,
      tools.ERASER
    ];
    return annTools;
  }

  public getRedactionToolsArray(instance: WebViewerInstance): Core.Tools.ToolNames[]{
    const tools = instance.Core.Tools.ToolNames;
    const redTools = [
      tools.REDACTION,
      tools.REDACTION2,
      tools.REDACTION3,
      tools.REDACTION4
    ];
    return redTools;
  }

  public isOfficeFile(ext: string): boolean {
    return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pub'].includes(ext);
  }

  public replaceOrAppendExtension(filename: string, newExtension: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      // Replace existing extension
      return filename.slice(0, lastDotIndex) + '.' + newExtension;
    } else {
      // Append new extension
      return filename + '.' + newExtension;
    }
  }
}
