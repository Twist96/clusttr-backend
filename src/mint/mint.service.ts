import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUploadAsset, UploadAssetDto } from './dto/upload_asset.dto';
import * as fs from 'fs';
import { resolve } from 'path';
import { rejects } from 'assert';
import { InjectModel } from '@nestjs/mongoose';
import { UploadAsset } from './schema/upload_asset.schema';
import { Model } from 'mongoose';
import { UploadAssetQueryDto } from './dto/upload_asset_query.dto';

@Injectable()
export class MintService {
  constructor(
    @InjectModel(UploadAsset.name) private uploadAssetModel: Model<UploadAsset>,
  ) {}

  async getAsset(assetId: string): Promise<UploadAssetDto> {
    try {
      const asset = await this.uploadAssetModel.findById(assetId);
      if (!asset) {
        throw new NotFoundException();
      }
      return createUploadAsset(asset);
    } catch (error) {
      throw error;
    }
  }

  async searchAsset(query: UploadAssetQueryDto): Promise<UploadAssetDto[]> {
    try {
      let assets = await this.uploadAssetModel.find({ ...query });
      return assets.map((x) => createUploadAsset(x));
    } catch (error) {
      throw error;
    }
  }

  async uploadAsset(asset: UploadAssetDto): Promise<UploadAssetDto> {
    try {
      const result = await this.uploadAssetModel.findOneAndUpdate(
        { assetKey: asset.assetKey },
        asset,
        { upsert: true },
      );

      const updatedAsset = await this.uploadAssetModel.findById(result.id);
      return createUploadAsset(updatedAsset);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateAssetMediaURL(
    id: string,
    displayImage: string,
    extraImages: string[],
  ): Promise<UploadAssetDto> {
    try {
      const result = await this.uploadAssetModel.findByIdAndUpdate(id, {
        displayImage,
        extraImages,
      });
      const updateAsset = await this.uploadAssetModel.findById(result.id);
      return createUploadAsset(updateAsset);
    } catch (error) {
      throw error;
    }
  }

  async addMoreInfo(): Promise<string> {
    return 'add more info';
  }

  async createAndMintAsset(): Promise<string> {
    return 'create asset';
  }
}
