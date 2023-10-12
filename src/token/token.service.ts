import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RecentToken } from './schema/token.schemas';
import { Model } from 'mongoose';
import { TokenUploadDto } from './dto/token-upload.dto';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(RecentToken.name) private readonly token: Model<RecentToken>,
  ) {}

  async addRecentToken(tokenUploadDto: TokenUploadDto): Promise<TokenDto> {
    const { token, creator } = tokenUploadDto;
    try {
      const tokenEntity = await this.token.create({ token, creator });
      const tokenDto = {
        id: tokenEntity.id,
        creator: tokenEntity.creator,
        token: tokenEntity.token,
      };
      return tokenDto;
    } catch (error) {
        throw new BadRequestException("Token already exist")
    }
  }

  async getRecentToken(): Promise<TokenDto[]> {
    const tokenEntities = await this.token.find({});
    const tokenDtos: TokenDto[] = tokenEntities.map((item) => ({
      id: item.id,
      creator: item.creator,
      token: item.token,
    }));
    return tokenDtos;
  }

  async deleteRecentToken(id: string): Promise<TokenDto> {
    try {
      const recentToken = await this.token.findByIdAndDelete(id);
      return {
        id: recentToken.id,
        token: recentToken.token,
        creator: recentToken.creator,
      };
    } catch (error) {
      throw new BadRequestException('Token may not exist');
    }
  }
}
