import {AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import WebViewer, {WebViewerInstance} from "@pdftron/webviewer";
import {Subject} from "rxjs";

@Component({
  selector: 'app-root',
  styleUrls: ['app.component.css'],
  templateUrl: 'app.component.html'
})
export class AppComponent implements AfterViewInit {
  wvInstance?: WebViewerInstance;
  
  @ViewChild('viewer') viewer!: ElementRef;
  
  @Output() coreControlsEvent:EventEmitter<string> = new EventEmitter();

  private documentLoaded$: Subject<void>;
  public documentPath = '';

  constructor() {
    this.documentLoaded$ = new Subject<void>();
  }

  ngAfterViewInit(): void {

    WebViewer.WebComponent({
      path: './lib',
      //initialDoc: './files/webviewer-demo-annotated.pdf',
      licenseKey: 'demo:1690814661066:7c449a78030000000000a9ce576776dba259f1d308e285996a8b17d46a'  // sign up to get a free trial key at https://dev.apryse.com      
    }, this.viewer.nativeElement).then(instance => {
      this.wvInstance = instance;

      this.coreControlsEvent.emit(instance.UI.LayoutMode.Single);

      const { documentViewer, Annotations, annotationManager } = instance.Core;

      const getMouseLocation = (e: MouseEvent) => {
        const scrollElement = instance.Core.documentViewer.getScrollViewElement();
        const scrollLeft = scrollElement.scrollLeft || 0;
        const scrollTop = scrollElement.scrollTop || 0;
      
        return {
          x: e.pageX + scrollLeft,
          y: e.pageY + scrollTop,
        };
      };

      // One click zoom feature
      // On click should set zoom level to a predefined level
      // AND set the clicked coordinates of the document to the center of the viewer
      let quickZoomTool = new instance.Core.Tools.Tool(documentViewer);
      quickZoomTool.cursor = 'zoom-in';
      quickZoomTool.name ="QuickZoom";
      quickZoomTool.mouseLeftDown = (e) =>{
        console.log("Zoom Level:" + instance.UI.getZoomLevel());
        const currentZoom = instance.UI.getZoomLevel();
        const scrollViewElement = documentViewer.getScrollViewElement() as HTMLElement;
        const currentXScroll = scrollViewElement.offsetWidth / 2;
        const currentYScroll = scrollViewElement.offsetHeight / 2;

        const newZoom = 6;

        const windowCoordinates = getMouseLocation(e);

        const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
        // takes a start and end point but we just want to see where a single point is located
        const page = displayMode.getSelectedPages(
          windowCoordinates,
          windowCoordinates
        );
        const clickedPage =
          page.first !== null ? page.first : documentViewer.getCurrentPage();

        // get the page coordinate of where the mouse was clicked
        const pageCoordinates = displayMode.windowToPage(
          windowCoordinates,
          clickedPage
        );

        documentViewer.zoomToMouse(newZoom, 0, 0);

        // get the updated window coordinates for the specific page coordinates after zooming
        const newWindowCoordinates = displayMode.pageToWindow(pageCoordinates, clickedPage);

        const viewportWidthCenter = scrollViewElement.offsetWidth / 2;
        const viewportHeightCenter = scrollViewElement.offsetHeight / 2;

        scrollViewElement.scroll({
          left: newWindowCoordinates.x - viewportWidthCenter,
          top: newWindowCoordinates.y - viewportHeightCenter,
          //behavior: "smooth",
        });

        instance.UI.setToolMode("Pan");
        e.preventDefault();
      }

      const quickZoomToolRegister = {
        toolName: 'QuickZoom',
        toolObject: quickZoomTool,
        buttonImage: 'icon-zoom-thumb-in',
        buttonName: 'quickZoom',
        buttonGroup: 'miscTool',
        toolTip: 'Quick Zoom'
      }

      const quickZoomButton = {
        type: 'toolButton',   
        toolName: 'QuickZoom',       
        dataElement: 'quickZoomButton',
        title: 'Quick Zoom'
      }

      instance.UI.registerTool(quickZoomToolRegister, undefined, undefined);

      instance.UI.setHeaderItems(header => {
        let items = header.getItems();
        console.log(items);
        items.splice(6, 0, quickZoomButton);
        header.update(items);
      });

      const newActionButton = {
        type: 'actionButton',
        img: 'illustration - empty state - outlines',
        onClick: () => {
          this.loadDocument('/files/webviewer-demo-annotated.pdf', instance);
        },
        dataElement: 'loadButton',
      };

      instance.UI.setHeaderItems(header => {
        let items = header.getItems();
        console.log(items);
        items.splice(7, 0, newActionButton);
        header.update(items);
      });


      instance.UI.setCustomPanel({
        tab: {
          dataElement: 'documentListPanel',
          title: 'Related Documents',
          img: 'illustration - empty state - outlines'
        },
        panel: {
          dataElement: 'documentList',
          render: () => {
            var div = window.document.getElementById('documentList') || window.document.createElement('div');
            return div;
          }
        }
      });

      instance.UI.setCustomPanel({
        tab: {
          dataElement: 'documentListPanel2',
          title: 'Related Documents2',
          img: 'illustration - empty state - outlines'
        },
        panel: {
          dataElement: 'documentList2',
          render: () => {
            var div = window.document.getElementById('documentList2') || window.document.createElement('div');
            return div;
          }
        }
      });

      instance.UI.openElements(['leftPanel']);

      documentViewer.addEventListener('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      documentViewer.addEventListener('documentLoaded', () => {
        this.documentLoaded$.next();
        const rectangleAnnot = new Annotations.RectangleAnnotation({
          PageNumber: 1,
          // values are in page coordinates with (0, 0) in the top left
          X: 100,
          Y: 150,
          Width: 200,
          Height: 50,
          Author: annotationManager.getCurrentUser()
        });
        annotationManager.addAnnotation(rectangleAnnot);
        annotationManager.redrawAnnotation(rectangleAnnot);
      });
      this.loadDocument('/files/webviewer-demo-annotated.pdf', instance);
    })
  }
  
  public loadDocument(path: string, instance: WebViewerInstance){
    const { documentViewer } = instance.Core;
    this.documentPath = path;
    instance.UI.loadDocument(path, {
      customHeaders: { Authorization: `Bearer token` },
      extension: 'pdf',
      filename: 'hi.pdf',
    });
    documentViewer.setDocumentXFDFRetriever(async () => {
      var result;
      return result || '';
    });
  }

  public async docListSelect() {
    this.loadDocument('/files/webviewer-demo-annotated.pdf', this.wvInstance!);
  }
}
